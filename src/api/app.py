import sqlite3
import logging as log
import sys
import traceback
import json
from flask import Flask
from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException
from flask_cors import CORS, cross_origin
from util import DbUtils
from util import PasswordUtils
from models.user import User
from util import SecurityUtils


log.basicConfig(level=log.INFO)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

db = DbUtils()
security_utils = SecurityUtils()
user_model = User()

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
    return jsonify(get_employers())


@cross_origin()
@app.route("/api/v1/employer/<slug>", methods=['GET'])
def get_employer_by_slug_route(slug):
    return jsonify(get_employers(slug))


def get_employers(slug=None):
    try:
        conn = db.connect_db()
        params = ()
        where_and_order_clause = '''
            ORDER BY e.name
        '''
        if slug is not None:
            params = (slug,)
            where_and_order_clause = '''
                WHERE e.slug = ?
            '''
        query = '''
            SELECT  e.id,
                    e.name,
                    e.image,
                    e.description,
                    es.name AS companySize
            FROM employers e
            JOIN employer_sizes es ON es.id = e.employer_size_id
        ''' + where_and_order_clause
        cursor = conn.execute(query, params)
        results = db.get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_employers error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)

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
    return jsonify(get_employer_reviews(slug))


def get_employer_id_by_slug(slug):
    try:
        conn = db.connect_db()
        query = '''
            SELECT  e.id
            FROM employers e 
            WHERE e.slug = ?
        '''
        cursor = conn.execute(query, (slug,))
        results = db.get_list_from_rows(cursor)
        if results:
            return results[0]['id']
    except sqlite3.Error as er:
        log.error('get_employer_id_by_slug error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)


def get_employer_reviews(slug):
    try:
        conn = db.connect_db()
        employer_id = get_employer_id_by_slug(slug)
        results = []
        if employer_id:
            query = '''
                SELECT  r.body,
                        DATETIME(r.created_at, 'localtime') AS createdAt,
                        u.name AS reviewAuthor,
                        u.avatar_filename AS avatarFilename,
                        u.id AS reviewAuthorUserId
                FROM reviews r
                JOIN users u ON u.id = r.user_id
                WHERE r.active = 1
                AND r.employer_id = ?
                ORDER BY r.created_at DESC
            '''
            cursor = conn.execute(query, (employer_id,))
            results = db.get_list_from_rows(cursor)

        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_employer_reviews error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)


@cross_origin()
@app.route("/api/v1/employer/reviewCountList", methods=['GET'])
def employer_review_count_list_route():
    return jsonify(get_employer_review_counts())


def get_employer_review_counts():
    '''Retrieves list of review counts for each employer'''
    try:
        conn = db.connect_db()
        query = '''
            SELECT  employer_id AS employerId,
                    COUNT(*) AS reviewCount
            FROM reviews r
            WHERE 1=1
            AND r.active = 1
            GROUP BY employer_id
        '''
        cursor = conn.execute(query)
        results = db.get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_employer_review_count error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)


@cross_origin()
@app.route("/api/v1/employer/<slug>/verifiedEmployees", methods=['GET'])
def verified_employees_route(slug):
    return jsonify(get_verified_employees(slug))


def get_verified_employees(slug):
    try:
        conn = db.connect_db()
        query = '''
            SELECT  ve.start_date AS startDate,
                    ve.end_date AS endDate,
                    ve.user_id AS userId,
                    ve.employer_id AS employerId,
                    DATETIME(ve.created_at, 'localtime') AS createdAt,
                    CASE WHEN ve.end_date IS NULL OR DATE(ve.end_date) > DATE('now', 'localtime')
                    THEN 1
                    ELSE 0
                    END AS isCurrentEmployee
            FROM verified_employees ve
            JOIN users u ON u.id = ve.user_id
            JOIN employers e ON e.id = ve.employer_id
            WHERE e.slug = ?
        '''
        cursor = conn.execute(query, (slug,))
        results = db.get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_verified_employees error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)


@cross_origin()
@app.route("/api/v1/employer/reviews", methods=['POST'])
def add_employer_review_route():
    req_json = request.json
    employer_id = req_json['employerId']
    body = req_json['body']
    return jsonify(add_employer_review(employer_id, body))


def add_employer_review(employer_id, body):
    user = user_model.is_reviewer()
    if user:
        try:
            conn = db.connect_db()
            user_id = user['id']
            query = '''
                INSERT INTO reviews(user_id, employer_id, body)
                VALUES(?, ? , ?)
            '''
            cursor = conn.execute(query, (user['id'], employer_id, body))
            conn.commit()
            log.info('Added review for employer {} from user {}'.format(
                employer_id, user_id))
            return {
                'status': 'OK'
            }
        except sqlite3.Error as er:
            log.error('add_employer_review error: %s' %
                      (' '.join(er.args)))
        finally:
            db.close_connection(conn)
    else:
        log.error('access denied to post review!')
        return security_utils.get_access_denied_response()


@cross_origin()
@app.route("/api/v1/employer/job", methods=['POST'])
def add_job_route():
    token = db.get_token_from_header()
    user = None

    if token:
        user = user_model.get_user_by_token(token)

        if user is not None:
            req_json = request.json
            try:
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
            log.error('Could not find user with token')
            return security_utils.get_access_denied_response()
    else:
        log.error('No token supplied')
        return security_utils.get_access_denied_response()


@cross_origin()
@app.route("/api/v1/recruiters", methods=['GET'])
def recruiters_route():
    token = db.get_token_from_header()
    if token:
        user = user_model.get_user_by_token(token)
        if user:
            return jsonify(get_recruiters(user['id']))
        else:
            return security_utils.get_access_denied_response()
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


@cross_origin()
@app.route("/api/v1/user/roles", methods=['GET'])
def roles_route():
    token = db.get_token_from_header()
    if token:
        user = user_model.get_user_by_token(token)
        if user:
            role = Role()
            return jsonify(role.get_roles_by_user_id(user['id']))
        else:
            return security_utils.get_access_denied_response()
    else:
        return security_utils.get_access_denied_response()
