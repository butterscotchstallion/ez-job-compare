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
