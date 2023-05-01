import sqlite3
import logging as log
import sys
import traceback
import json
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from werkzeug.exceptions import HTTPException
from util import DbUtils, PasswordUtils, SecurityUtils
from models import User, Employer, HelpfulReviewVotes, Karma

log.basicConfig(level=log.INFO)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

db = DbUtils()
security_utils = SecurityUtils()
karma_model = Karma()
user_model = User(karma_model=karma_model)
employer_model = Employer()
review_votes_model = HelpfulReviewVotes()

@app.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response


##############
### Routes ###
##############

# Employers


@cross_origin()
@app.route("/api/v1/employers", methods=['GET'])
def list_employers():
    return jsonify(employer_model.get_employers())


@cross_origin()
@app.route("/api/v1/employer/<slug>", methods=['GET'])
def get_employer_by_slug_route(slug):
    return jsonify(employer_model.get_employers(slug))


# Tags


@cross_origin()
@app.route("/api/v1/tags", methods=['GET'])
def list_tags():
    return jsonify(get_tags())


def get_tags():
    try:
        conn = db.connect_db()
        query = '''
            SELECT  t.id,
                    t.name,
                    t.slug,
                    t.icon
            FROM tags t
            ORDER BY t.name
        '''
        cursor = conn.execute(query)
        results = db.get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_tags error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)

# Employers tags


@cross_origin()
@app.route("/api/v1/employers/tagsMap", methods=['GET'])
def list_employer_tags_map():
    return jsonify(get_employers_tags())


def get_employers_tags():
    try:
        conn = db.connect_db()
        query = '''
            SELECT  et.employer_id AS employerId,
                    et.tag_id AS tagId
            FROM employers_tags et
            JOIN employers e ON e.id = et.employer_id
            JOIN tags t ON t.id = et.tag_id
        '''
        cursor = conn.execute(query)
        results = db.get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_employers_tags error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)

# Jobs


@cross_origin()
@app.route("/api/v1/jobs", methods=['GET'])
def list_jobs():
    query = request.args.get('query')
    salary_range_min = request.args.get('salaryRangeMin')
    salary_range_max = request.args.get('salaryRangeMax')
    tag_ids = request.args.get('tagIds')
    return jsonify(get_jobs(query=query,
                            salary_range_min=salary_range_min,
                            salary_range_max=salary_range_max,
                            tag_ids=tag_ids))


def get_jobs(**kwargs):
    try:
        conn = db.connect_db()
        queryClause = ''
        params = []
        tagJoinClause = ''

        # Search query
        if kwargs['query']:
            param = "%{}%".format(kwargs['query'])
            queryClause = ' AND j.title LIKE ? '
            queryClause += ' OR j.short_description LIKE ? '
            queryClause += ' OR j.long_description LIKE ? '
            queryClause += ' OR e.name LIKE ? '
            queryClause += ' OR j.location LIKE ?'
            params = [param, param, param, param, param]

        # Handle salary min/max range
        if kwargs['salary_range_min'] is not None:
            queryClause += ' AND j.salary_range_start >= ? '
            params.append(kwargs['salary_range_min'])

        if kwargs['salary_range_max'] is not None:
            queryClause += ' AND j.salary_range_end <= ? '
            params.append(kwargs['salary_range_max'])

        query = '''
            SELECT  j.id,
                    j.title,
                    j.short_description AS shortDescription,
                    j.long_description AS longDescription,
                    j.salary_range_start AS salaryRangeStart,
                    j.salary_range_end AS salaryRangeEnd,
                    j.created_at AS createdAt,
                    j.updated_at AS updatedAt,
                    j.slug,
                    j.location,
                    e.id AS employerId,
                    e.name AS employerName,
                    e.slug AS employerSlug,
                    es.name AS companySize,
                    e.website AS employerWebsite
            FROM jobs j
            JOIN employers e on e.id = j.employer_id
            JOIN employer_sizes es ON e.employer_size_id = es.id
            WHERE 1=1
            ''' + queryClause + '''
            ORDER BY j.created_at DESC, j.title
        '''
        cursor = conn.execute(query, params)
        results = db.get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_jobs error: %s' % (' '.join(er.args)))
        return {
            'status': 'ERROR',
            'message': er
        }
    finally:
        db.close_connection(conn)

# Jobs tags


@cross_origin()
@app.route("/api/v1/jobs/tagsMap", methods=['GET'])
def list_jobs_tags_map():
    return jsonify(get_jobs_tags())


def get_jobs_tags():
    try:
        conn = db.connect_db()
        query = '''
            SELECT  jt.job_id AS jobId,
                    jt.tag_id AS tagId
            FROM jobs_tags jt
            JOIN jobs j ON j.id = jt.job_id
            JOIN tags t ON t.id = jt.tag_id
        '''
        cursor = conn.execute(query)
        results = db.get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_jobs_tags error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)

# Jobs count


@cross_origin()
@app.route("/api/v1/employers/jobCount", methods=['GET'])
def list_job_count():
    return jsonify(get_job_count())


def get_job_count():
    try:
        conn = db.connect_db()
        query = '''
            SELECT  e.id AS employerId,
                    e.name AS employerName,
                    COUNT(*) as jobCount
            FROM employers e
            JOIN jobs j ON j.employer_id = e.id
            GROUP BY e.id
        '''
        cursor = conn.execute(query)
        results = db.get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_job_tags error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)

# User


@cross_origin()
@app.route("/api/v1/user/login", methods=['POST'])
def user_login_route():
    req_json = request.json
    username = req_json['data']['username']
    password = req_json['data']['password']
    return jsonify(user_login(username, password))


@cross_origin()
@app.route("/api/v1/user/session", methods=['GET'])
def user_session_route():
    token = db.get_token_from_header()
    log.info('Checking token: {}'.format(token))
    return jsonify(user_model.is_session_active(token))

def user_login(username, password):
    '''
    1. Check credentials
    2. Check if a session token exists already that we can update
    3. Create session token if not
    '''
    if user_model.check_credentials(username, password):
        token = user_model.get_or_create_session_token(username)
        user = None
        if token:
            user = user_model.get_user_by_token(token)

            # Add roles
            if user:
                user['roles'] = user_model.get_roles_by_user_id(user['id'])
        return {
            'status': 'OK',
            'results': [
                {
                    'token': token,
                    'user': user
                }
            ]
        }
    else:
        log.error('Check password failed')
        return {
            'status': 'ERROR',
            'message': 'Invalid credentials'
        }


# Reviews


@cross_origin()
@app.route("/api/v1/employer/<slug>/reviews", methods=['GET'])
def employer_reviews_route(slug):
    return jsonify(employer_model.get_employer_reviews(slug))

@cross_origin()
@app.route("/api/v1/employer/reviewCountList", methods=['GET'])
def employer_review_count_list_route():
    user_id = request.args.get('userId')
    return jsonify(employer_model.get_employer_review_counts(user_id))

@cross_origin()
@app.route("/api/v1/employer/<slug>/helpfulReviewVotes", methods=['GET'])
def helpful_review_votes_route(slug):
    return jsonify(review_votes_model.get_votes_by_employer_slug(slug))

@cross_origin()
@app.route("/api/v1/employer/<slug>/helpfulReviewVotes", methods=['POST'])
def add_helpful_review_votes_route(slug):
    '''
    1. Check that we have a valid session user
    2. Get votes for employer and map it up
    3. Check if current user has voted on this review before
    4. Send back access denied where necessary
    '''
    user = user_model.is_voter()
    review_id = request.json['reviewId']
    user_has_voted = False
    if user and review_id:
        '''
        Two scenarios are possible here:
        1. Employer has reviews
        2. Employer has no reviews
        '''
        response = review_votes_model.get_votes_by_employer_slug(slug)
        votes = response['results']
        if votes:
            review_votes_map = review_votes_model.get_review_votes_map(votes)

            if review_id in review_votes_map:
                review_votes = review_votes_map[review_id]
                has_voted_map = review_votes_model.get_has_voted_map(review_votes)
                user_has_voted = user['id'] in has_voted_map

        if not user_has_voted:
            log.info('Adding vote for review {} from user {} ({})'.format(
                review_id,
                user['name'],
                user['id']
            ))
            return jsonify(review_votes_model.add_helpful_vote(review_id, user['id']))
        else:
            log.error('User {} has already voted on review {}'.format(user['name'], review_id))
    else:
        return security_utils.get_access_denied_response()

@cross_origin()
@app.route("/api/v1/employer/<slug>/verifiedEmployees", methods=['GET'])
def verified_employees_route(slug):
    '''Verified employees for a specific employer'''
    return jsonify(employer_model.get_verified_employees(slug))


@cross_origin()
@app.route("/api/v1/employer/verifiedEmployees", methods=['GET'])
def all_verified_employees_route():
    '''
    Get employee status for each employer which will be mapped
    and used in the user profile summary.
    '''
    return jsonify(employer_model.get_verified_employees())

@cross_origin()
@app.route("/api/v1/employer/reviews", methods=['POST'])
def add_employer_review_route():
    user = user_model.get_user_by_token()
    if user:
        req_json = request.json
        employer_id = req_json['employerId']
        body = req_json['body']
        return jsonify(employer_model.add_employer_review(employer_id, body))
    else:
        return security_utils.get_access_denied_response()

@cross_origin()
@app.route("/api/v1/employer/job", methods=['POST'])
def add_job_route():
    user = user_model.is_recruiter()

    if user:
        try:
            req_json = request.json
            conn = db.connect_db()
            query = '''
                INSERT INTO jobs(
                    title, 
                    short_description,
                    salary_range_start,
                    salary_range_end,
                    employer_id,
                    location)
                VALUES(?, ?, ?, ?, ?, ?)
            '''
            params = (
                req_json['title'],
                req_json['shortDescription'],
                req_json['salaryRangeStart'],
                req_json['salaryRangeEnd'],
                req_json['employerId'],
                req_json['location']
            )
            cursor = conn.execute(query, params)
            conn.commit()
            return {
                'status': 'OK'
            }
        except sqlite3.Error as er:
            log.error('add_job_route error: %s' % (' '.join(er.args)))
        finally:
            db.close_connection(conn)
    else:
        return security_utils.get_access_denied_response()

@cross_origin()
@app.route("/api/v1/recruiters", methods=['GET'])
def recruiters_route():
    user = user_model.get_user_from_token_header()
    if user:
        return jsonify(get_recruiters(user['id']))
    else:
        return security_utils.get_access_denied_response()

def get_recruiters(user_id):
    try:
        conn = db.connect_db()
        query = '''
            SELECT  eu.user_id AS userId,
                    eu.employer_id AS employerId
            FROM employers_users eu
            WHERE eu.user_id = ?
        '''
        cursor = conn.execute(query, (user_id,))
        results = db.get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        error = ' '.join(er.args)
        log.error('get_recruiters error: %s' % (error))
        return {
            'status': 'ERROR',
            'message': error
        }
    finally:
        db.close_connection(conn)

### Users

@cross_origin()
@app.route("/api/v1/users", methods=['GET'])
def user_list_route():
    return jsonify(user_model.get_users())

@cross_origin()
@app.route("/api/v1/karmaSummary", methods=['GET'])
def karma_summary_route():
    user = user_model.get_user_from_token_header()
    if user:
        return jsonify(karma_model.get_karma_summary())
    else:
        return security_utils.get_access_denied_response()

@cross_origin()
@app.route("/api/v1/users/<guid>/karma", methods=['GET'])
def user_karma_route(guid):
    user = user_model.get_user_from_token_header()
    if user:
        return jsonify(karma_model.get_karma_by_user_id(user['id']))
    else:
        return security_utils.get_access_denied_response()

@cross_origin()
@app.route("/api/v1/topKarmaUser", methods=['GET'])
def top_karma_user_route():
    user = user_model.get_user_from_token_header()
    if user:
        return jsonify(karma_model.get_top_karma_user())
    else:
        return security_utils.get_access_denied_response()