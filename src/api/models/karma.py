import logging as log
import sqlite3
from util import DbUtils

db = DbUtils()
log.basicConfig(level=log.INFO)


class Karma:

    def get_karma_by_user_id(self, user_id):
        '''
        User karma is the sum of all votes on reviews
        the user has authored.
        '''
        try:
            conn = db.connect_db()
            query = '''
                SELECT  SUM(v.user_id) as karma
                FROM helpful_review_votes v
                JOIN reviews r ON r.id = v.review_id
                WHERE 1=1
                AND r.user_id = ?
                GROUP BY v.user_id
            '''
            cursor = conn.execute(query, (user_id,))
            results = db.get_list_from_rows(cursor)
            return {
                'status': 'OK',
                'results': results
            }
        except sqlite3.Error as er:
            log.error('get_karma_by_user_id error: %s' %
                      (' '.join(er.args)))
        finally:
            db.close_connection(conn)