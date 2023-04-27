import logging as log
import sqlite3
from util import DbUtils
from util import DbUtils

db = DbUtils()
DB_PATH = 'database.db'
log.basicConfig(level=log.INFO)


class Role:
	
	def get_roles_by_user_id(self, user_id):
	    try:
	        conn = db.connect_db()
	        query = '''
	            SELECT  r.name
	            FROM roles r
	            JOIN users_roles ur ON ur.role_id = r.id
	            LEFT JOIN users u ON u.id = ur.user_id
	            WHERE 1=1
	            AND u.id = ?
	        '''
	        cursor = conn.execute(query, (user_id,))
	        results = db.get_list_from_rows(cursor)
	        roles = [r['name'] for r in results]
	        return roles
	    except sqlite3.Error as er:
	        error = ' '.join(er.args)
	        log.error('get_roles_by_user_id error: %s' % (error))
	        return {
	            'status': 'ERROR',
	            'message': error
	        }
	    finally:
	        db.close_connection(conn)
