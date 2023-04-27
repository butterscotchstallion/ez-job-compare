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
