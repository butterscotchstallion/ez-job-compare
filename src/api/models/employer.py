import logging as log
import sqlite3
from util import DbUtils

db = DbUtils()
log.basicConfig(level=log.INFO)

class Employer:

    def get_recruiter_employers_by_user_id(self, user_id):
        try:
            conn = db.connect_db()
            query = '''
                SELECT  e.id,
                        e.name,
                        e.image,
                        e.description,
                        es.name AS companySize
                FROM employers e
                JOIN verified_employees ve ON ve.employer_id = e.id
                WHERE ve.user_id = ?
            '''
            cursor = conn.execute(query, (user_id,))
            results = db.get_list_from_rows(cursor)
            return {
                'status': 'OK',
                'results': results
            }
        except sqlite3.Error as er:
            log.error('get_recruiter_employers_by_user_id error: %s' % (' '.join(er.args)))
        finally:
            db.close_connection(conn)


    def get_employers(self, slug=None):
        try:
            conn = db.connect_db()
            params = ()
            where_and_order_clause = '''
                ORDER BY e.name
            '''
            if slug:
                log.info(slug)
                params = (slug,)
                where_and_order_clause = '''
                    WHERE e.slug = ?
            '''
            query = '''
                SELECT  e.id,
                        e.name,
                        e.image,
                        e.description,
                        es.name AS companySize,
                        e.slug
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

    def get_verified_employees(self, slug=None, user_id=None):
        try:
            conn = db.connect_db()
            where_clause = ''
            group_clause = ''
            params = ()
            if slug:
                where_clause = ' AND e.slug = ? '
                params = (slug,)

            if user_id:
                where_clause = ' AND ve.user_id = ? '
                params = (user_id,)

            if not slug and not user_id:
                group_clause = ' GROUP BY employer_id '

            query = '''
                SELECT  ve.start_date AS startDate,
                        ve.end_date AS endDate,
                        ve.user_id AS userId,
                        ve.employer_id AS employerId,
                        DATETIME(ve.created_at, 'localtime') AS createdAt,
                        CASE WHEN ve.end_date IS NULL
                        THEN 1
                        ELSE 0
                        END AS isCurrentEmployee
                FROM verified_employees ve
                JOIN users u ON u.id = ve.user_id
                JOIN employers e ON e.id = ve.employer_id
                WHERE 1=1
            ''' + where_clause + group_clause
            cursor = conn.execute(query, params)
            results = db.get_list_from_rows(cursor)
            return {
                'status': 'OK',
                'results': results
            }
        except sqlite3.Error as er:
            error = ' '.join(er.args)
            log.error('get_verified_employees error: %s' % (error))
            return {
                'status': 'ERROR',
                'message': error
            }
        finally:
            db.close_connection(conn)

    def get_employer_id_by_slug(self, slug):
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

    def get_employer_reviews(self, slug):
        try:
            conn = db.connect_db()
            results = []
            query = '''
                SELECT  r.id,
                        r.body,
                        DATETIME(r.created_at, 'localtime') AS createdAt,
                        u.name AS reviewAuthor,
                        u.avatar_filename AS avatarFilename,
                        u.id AS reviewAuthorUserId,
                        e.slug as employerSlug
                FROM reviews r
                JOIN users u ON u.id = r.user_id
                JOIN employers e on e.id = r.employer_id
                WHERE r.active = 1
                AND e.slug = ?
                ORDER BY r.created_at DESC
            '''
            cursor = conn.execute(query, (slug,))
            results = db.get_list_from_rows(cursor)

            return {
                'status': 'OK',
                'results': results
            }
        except sqlite3.Error as er:
            log.error('get_employer_reviews error: %s' % (' '.join(er.args)))
        finally:
            db.close_connection(conn)

    def get_employer_review_counts(self, user_id=None):
        '''Retrieves list of review counts for each employer'''
        try:
            conn = db.connect_db()
            params = ()
            user_id_where_clause = ''

            if user_id:
                user_id_where_clause = ' AND r.user_id = ? '
                params = (user_id,)

            query = '''
                SELECT  employer_id AS employerId,
                        e.name AS employerName,
                        COUNT(*) AS reviewCount
                FROM reviews r
                JOIN employers e ON e.id = r.employer_id
                WHERE 1=1
                AND r.active = 1
                ''' + user_id_where_clause + '''
                GROUP BY employer_id
            '''
            cursor = conn.execute(query, params)
            results = db.get_list_from_rows(cursor)
            return {
                'status': 'OK',
                'results': results
            }
        except sqlite3.Error as er:
            log.error('get_employer_review_count error: %s' % (' '.join(er.args)))
        finally:
            db.close_connection(conn)

    def add_employer_review(self, employer_id, body):
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


