import logging as log
import sqlite3
from util import DbUtils
from util import PasswordUtils

db = DbUtils()
pw_utils = PasswordUtils()
log.basicConfig(level=log.INFO)


class User:
    '''User/session model'''

    def check_credentials(self, username, password):
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
                log.info('No results for password with \
                    username {}'.format(username))
                return False
        except sqlite3.Error as er:
            log.error('check_credentials error: %s' % (' '.join(er.args)))
        finally:
            db.close_connection(conn)

    def get_user_by_token(self, token):
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

    def get_users(self):
        try:
            conn = db.connect_db()
            query = '''
                SELECT  u.name,
                        u.id
                FROM users u
                WHERE 1=1
                AND u.active = 1
                ORDER BY u.name
            '''
            cursor = conn.execute(query)
            results = db.get_list_from_rows(cursor)
            return {
                'status': 'OK',
                'results': results
            }
        except sqlite3.Error as er:
            error = ' '.join(er.args)
            log.error('get_users error: %s' % (error))
            return {
                'status': 'ERROR',
                'message': error
            }
        finally:
            db.close_connection(conn)

    def get_or_create_session_token(self, username):
        '''Returns session token if exists, creates if not'''
        try:
            conn = db.connect_db()
            query = '''
                SELECT  ut.token
                FROM user_tokens ut
                JOIN users u ON u.id = ut.user_id
                WHERE 1=1
                AND u.name = ?
                AND u.active = 1
                AND ut.created_at > DATE('now', 'localtime', ?)
            '''
            duration = db.get_duration_clause()
            cursor = conn.execute(query, (username, duration))
            results = db.get_list_from_rows(cursor)
            if results:
                token = results[0]['token']
                log.info('Found existing token for user {}: {}'.format(
                    username, token))
                return token
            else:
                user_id = self.get_user_id_by_username(username)
                if user_id:
                    token = pw_utils.generate_password(255)
                    query = '''
                        REPLACE INTO user_tokens(user_id, token, created_at)
                        VALUES(?, ?, DATE('now', 'localtime'))
                    '''
                    cursor = conn.execute(query, (user_id, token))
                    conn.commit()
                    log.info('Created new token for user {}:{}'.format(
                        username, token))
                    return token
                else:
                    log.error('Failed to get user id for user\
                     {}'.format(username))
        except sqlite3.Error as er:
            log.error('get_login_token_by_user_id error: %s' %
                      (' '.join(er.args)))
        finally:
            db.close_connection(conn)

    def is_session_active(self, token):
        if token:
            try:
                conn = db.connect_db()
                duration = db.get_duration_clause()
                query = '''
                        SELECT COUNT(*) as activeSessions
                        FROM user_tokens
                        WHERE 1=1
                        AND created_at >= DATETIME('now', 'localtime', ?)
                        AND token = ?
                    '''
                cursor = conn.execute(query, (duration, token))
                results = db.get_list_from_rows(cursor)
                is_active = len(
                    results) > 0 and results[0]['activeSessions'] > 0
                user = None
                if is_active:
                    log.info('Active session found')
                    user = self.get_user_with_roles()
                else:
                    log.info('Inactive session found')
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
                log.error('is_session_active error: %s' %
                          (' '.join(er.args)))
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

    def get_user_id_by_username(self, username):
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
            log.error('get_user_id_by_username error: %s' %
            (' '.join(er.args)))
        finally:
            db.close_connection(conn)

    def update_session_token(self, token):
        try:
            conn = db.connect_db()
            query = '''
                UPDATE user_tokens
                SET updated_at = DATETIME('now', 'localtime'),
                created_at = DATETIME('now', 'localtime')
                WHERE token = ?
            '''
            cursor = conn.execute(query, (token,))
            conn.commit()
            return True
        except sqlite3.Error as er:
            log.error('update_session_token error: %s' %
            (' '.join(er.args)))
        finally:
            db.close_connection(conn)

    def get_user_from_token_header(self):
        token = db.get_token_from_header()
        if token:
            return self.get_user_by_token(token)

    def get_user_with_roles(self):
        user = self.get_user_from_token_header()
        if user:
            user['roles'] = self.get_roles_by_user_id(user['id'])
            return user

    def get_roles_by_user_id(self, user_id):
        try:
            conn = db.connect_db()
            query = '''
                SELECT  r.name,
                        r.color,
                        r.icon
                FROM roles r
                JOIN users_roles ur ON ur.role_id = r.id
                LEFT JOIN users u ON u.id = ur.user_id
                WHERE 1=1
                AND u.id = ?
            '''
            cursor = conn.execute(query, (user_id,))
            return db.get_list_from_rows(cursor)
        except sqlite3.Error as er:
            error = ' '.join(er.args)
            log.error('get_roles_by_user_id error: %s' % (error))
            return {
                'status': 'ERROR',
                'message': error
            }
        finally:
            db.close_connection(conn)

    def has_role(self, role, roles):
        for r in roles:
            if r['name'] == role:
                return True

    def is_voter(self):
        user = self.get_user_with_roles()
        if user:
            has_role = self.has_role('Voter', user['roles'])

            if has_role:
                return user
        else:
            return False

    def is_reviewer(self):
        '''Returns user object if true'''
        user = self.get_user_with_roles()
        if user:
            has_role = self.has_role('Reviewer', user['roles'])

            if has_role:
                return user
        else:
            return False

    def is_recruiter(self):
        user = self.get_user_with_roles()
        if user:
            has_role = self.has_role('Recruiter', user['roles'])
            if has_role:
                return user
