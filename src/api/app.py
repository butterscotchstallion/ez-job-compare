from flask import Flask
from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException
import sqlite3
import logging as log
import sys
import traceback
import json
from flask_cors import CORS, cross_origin

log.basicConfig(level=log.INFO)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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

### Employers
@cross_origin()
@app.route("/api/v1/employers", methods=['GET'])
def list_employers():
    return jsonify(get_employers())

def get_employers():
    try:
        conn = connect_db()
        query = '''
            SELECT  e.id,
                    e.name,
                    e.image,
                    e.description
            FROM employers e
            ORDER BY e.name
        '''
        cursor = conn.execute(query)
        results = get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_employers error: %s' % (' '.join(er.args)))
    finally:
        close_connection(conn)

### Tags
@cross_origin()
@app.route("/api/v1/tags", methods=['GET'])
def list_tags():
    return jsonify(get_tags())

def get_tags():
    try:
        conn = connect_db()
        query = '''
            SELECT  t.id,
                    t.name,
                    t.slug,
                    t.icon
            FROM tags t
            ORDER BY t.name
        '''
        cursor = conn.execute(query)
        results = get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_tags error: %s' % (' '.join(er.args)))
    finally:
        close_connection(conn)

### Employers tags
@cross_origin()
@app.route("/api/v1/employers/tagsMap", methods=['GET'])
def list_employer_tags_map():
    return jsonify(get_employers_tags())

def get_employers_tags():
    try:
        conn = connect_db()
        query = '''
            SELECT  et.employer_id AS employerId,
                    et.tag_id AS tagId
            FROM employers_tags et
            JOIN employers e ON e.id = et.employer_id
            JOIN tags t ON t.id = et.tag_id
        '''
        cursor = conn.execute(query)
        results = get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_employers_tags error: %s' % (' '.join(er.args)))
    finally:
        close_connection(conn)

### Jobs
@cross_origin()
@app.route("/api/v1/jobs", methods=['GET'])
def list_jobs():
    return jsonify(get_jobs())

def get_jobs():
    try:
        conn = connect_db()
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
                    e.name AS employerName,
                    e.slug AS employerSlug
            FROM jobs j
            JOIN employers e on e.id = j.employer_id
            ORDER BY j.created_at, j.title
        '''
        cursor = conn.execute(query)
        results = get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_jobs error: %s' % (' '.join(er.args)))
    finally:
        close_connection(conn)

### Jobs tags
@cross_origin()
@app.route("/api/v1/jobs/tagsMap", methods=['GET'])
def list_jobs_tags_map():
    return jsonify(get_jobs_tags())

def get_jobs_tags():
    try:
        conn = connect_db()
        query = '''
            SELECT  jt.job_id AS jobId,
                    jt.tag_id AS tagId
            FROM jobs_tags jt
            JOIN jobs j ON j.id = jt.job_id
            JOIN tags t ON t.id = jt.tag_id
        '''
        cursor = conn.execute(query)
        results = get_list_from_rows(cursor)
        return {
            'status': 'OK',
            'results': results
        }
    except sqlite3.Error as er:
        log.error('get_jobs_tags error: %s' % (' '.join(er.args)))
    finally:
        close_connection(conn)

##############
## Private ###
##############
def connect_db():
    with sqlite3.connect('./database.db') as conn:
        if conn:
            conn.row_factory = sqlite3.Row
    return conn

def close_connection(connection):
    if connection:
        connection.close()

def get_list_from_rows(cursor):
    results = []

    try:
        columns = [column[0] for column in cursor.description]
        
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))

        return results
    except:
        log.error('Error in get_list_from_rows')
    finally:
        return results