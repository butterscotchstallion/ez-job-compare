from flask import Flask
from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException
import sqlite3
import logging as log
import sys
import traceback
import json
from flask_cors import CORS, cross_origin
from util import DbUtils
from util import PasswordUtils

log.basicConfig(level=log.INFO)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

db = DbUtils()
pw_utils = PasswordUtils()


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


def get_employers():
    try:
        conn = db.connect_db()
        query = '''
            SELECT  e.id,
                    e.name,
                    e.image,
                    e.description,
                    es.name AS companySize
            FROM employers e
            JOIN employer_sizes es ON es.id = e.employer_size_id
            ORDER BY e.name
        '''
        cursor = conn.execute(query)
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
    token = request.headers.get('x-ezjobcompare-session-token')
    log.info('Checking token: {}'.format(token))
    return jsonify(is_session_active(token))


def is_session_active(token):
    '''Checks if session exists in the last day'''
    if token:
        try:
            conn = db.connect_db()
            query = '''
                SELECT COUNT(*) as activeSessions
                FROM user_tokens
                WHERE token = ?
                AND created_at > DATETIME('now', '-1 day')
            '''
            cursor = conn.execute(query, (token,))
            results = db.get_list_from_rows(cursor)
            is_active = len(results) > 0 and results[0]['activeSessions'] > 0
            user = None
            if is_active:
                user = get_user_by_token(token)
            return {
                'status': 'OK',
                'results': [
                    {
                        'active': is_active,
                        'user': user
                    }
                ]
            }
        except sqlite3.Error as er:
            log.error('is_session_active error: %s' % (' '.join(er.args)))
            return {
                'status': 'ERROR',
                'message': 'Error checking session'
            }
        finally:
            db.close_connection(conn)
    else:
        return {
            'status': 'ERROR',
            'results': [
                {
                    'active': false
                }
            ]
        }


def user_login(username, password):
    '''
    1. Check credentials
    2. Check if a session token exists already that we can update
    3. Create session token if not
    '''
    if check_credentials(username, password):
        token = get_or_create_session_token(username)
        user = None
        if token:
            user = get_user_by_token(token)

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


def check_credentials(username, password):
    '''Checks if supplied username and password matches'''
    try:
        conn = db.connect_db()
        query = '''
            SELECT password
            FROM users
            WHERE name = ?
        '''
        cursor = conn.execute(query, (username,))
        results = db.get_list_from_rows(cursor)

        if results:
            hashed_pw = results[0]['password']
            return pw_utils.check_password(password, hashed_pw)
        else:
            log.info('No results for password with username {}'.format(username))
            return False
    except sqlite3.Error as er:
        log.error('check_credentials error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)


def get_user_by_token(token):
    '''Retrieve user info based on session token'''
    try:
        conn = db.connect_db()
        query = '''
            SELECT  u.id,
                    u.name,
                    u.avatar_filename AS avatarFilename,
                    u.created_at AS createdAt,
                    u.updated_at AS updatedAt
            FROM users u
            JOIN user_tokens ut ON ut.user_id = u.id
            WHERE u.active = 1
            AND ut.token = ?
        '''
        cursor = conn.execute(query, (token,))
        results = db.get_list_from_rows(cursor)
        if results:
            return results[0]
    except sqlite3.Error as er:
        log.error('check_credentials error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)


def get_or_create_session_token(username):
    '''Returns session token if exists, creates if not'''
    try:
        conn = db.connect_db()
        query = '''
            SELECT  ut.token
            FROM user_tokens ut
            JOIN users u ON u.id = ut.user_id
            WHERE u.name = ?
            AND u.active = 1
        '''
        cursor = conn.execute(query, (username,))
        results = db.get_list_from_rows(cursor)
        if results:
            token = results[0]['token']
            log.info('Found existing token for user {}: {}'.format(
                username, token))
            return token
        else:
            user_id = get_user_id_by_username(username)
            if user_id:
                token = pw_utils.generate_password(255)
                query = '''
                    INSERT INTO user_tokens(user_id, token, created_at)
                    VALUES(?, ?, DATETIME('now', 'localtime'))
                '''
                cursor = conn.execute(query, (user_id, token))
                conn.commit()
                log.info('Created new token for user {}:{}'.format(
                    username, token))
                return token
            else:
                log.error('Failed to get user id for user {}'.format(username))
    except sqlite3.Error as er:
        log.error('get_login_token_by_user_id error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)


def get_user_id_by_username(username):
    try:
        conn = db.connect_db()
        query = '''
            SELECT id
            FROM users
            WHERE name = ?
        '''
        cursor = conn.execute(query, (username,))
        results = db.get_list_from_rows(cursor)
        if results:
            return results[0]['id']
    except sqlite3.Error as er:
        log.error('get_user_id_by_username error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)


def update_session_token(token):
    try:
        conn = db.connect_db()
        query = '''
            UPDATE user_tokens
            SET updated_at = DATETIME('now', 'localtime')
            WHERE token = ?
        '''
        cursor = conn.execute(query, (username,))
        conn.commit()
        return True
    except sqlite3.Error as er:
        log.error('update_session_token error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)

# Reviews


@cross_origin()
@app.route("/api/v1/employer/<slug>/reviews", methods=['GET'])
def employer_reviews_route():
    return jsonify(get_employer_reviews(slug))


def get_employer_reviews(slug):
    try:
        conn = db.connect_db()
        query = '''
            SELECT  body,
                    created_at AS createdAt
            FROM reviews r
            WHERE r.active = 1
        '''
        cursor = conn.execute(query, (username,))
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
