import logging as log
import sqlite3
from util import DbUtils

db = DbUtils()
log.basicConfig(level=log.INFO)


class Karma:

    def get_top_karma_user(self):
        conn = None
        try:
            conn = db.connect_db()
            query = '''
                SELECT  u.id AS userId,
                        COUNT(*) as karma
                FROM helpful_review_votes v
                JOIN reviews r ON r.id = v.review_id
                JOIN users u ON u.id = v.user_id
                WHERE 1=1
                GROUP BY r.user_id
                ORDER BY karma DESC
                LIMIT 1
            '''
            cursor = conn.execute(query)
            results = db.get_list_from_rows(cursor)
            return {
                'status': 'OK',
                'results': results
            }
        except sqlite3.Error as er:
            log.error('get_top_karma_user error: %s' %
                      (' '.join(er.args)))
        finally:
            db.close_connection(conn)

    def get_karma_by_guid(self, guid):
        conn = None
        try:
            conn = db.connect_db()
            query = '''
                SELECT COUNT(*) as karma
                FROM helpful_review_votes v
                JOIN reviews r ON r.id = v.review_id
                JOIN users u ON u.id = r.user_id
                WHERE 1=1
                AND u.guid = ?
                GROUP BY r.user_id
            '''
            cursor = conn.execute(query, (guid,))
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

    def get_karma_summary(self):
        conn = None
        try:
            conn = db.connect_db()
            query = '''
                SELECT  u.name,
                        COUNT(*) as karma
                FROM helpful_review_votes v
                JOIN users u ON u.id = v.user_id
                JOIN reviews r ON r.id = v.review_id
                GROUP BY v.user_id
            '''
            cursor = conn.execute(query)
            results = db.get_list_from_rows(cursor)
            return {
                'status': 'OK',
                'results': results
            }
        except sqlite3.Error as er:
            log.error('get_karma_summary error: %s' %
                      (' '.join(er.args)))
        finally:
            db.close_connection(conn)