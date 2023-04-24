'''
CLI utility to create users
'''
import argparse
import logging as log
import sqlite3
from util import PasswordUtils
from util import DbUtils

log.basicConfig(level=log.INFO)
pw_utils = PasswordUtils()
db = DbUtils()
DB_PATH = 'database.db'


def user_exists(username):

    try:
        conn = db.connect_db(DB_PATH)
        query = '''
            SELECT COUNT(*) AS userCount
            FROM users u
            WHERE u.name = ?
        '''
        cursor = conn.execute(query, (username,))
        results = db.get_list_from_rows(cursor)
        user_count = results[0]['userCount']
        return user_count > 0
    except sqlite3.Error as er:
        log.error('user_exists error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)


def create_user(username):
    try:
        conn = db.connect_db(DB_PATH)
        if not user_exists(username):
            query = '''
                INSERT INTO users(name, password)
                VALUES(?, ?)
            '''
            generated_password = pw_utils.generate_password()
            hashed = pw_utils.get_hashed_password(generated_password)
            cursor = conn.execute(query, (username, hashed))
            conn.commit()

            log.info('User created!')
            log.info('Password: {}'.format(generated_password))
            return True
        else:
            log.error('Username {} already exists'.format(username))
    except sqlite3.Error as er:
        log.error('create_user error: %s' % (' '.join(er.args)))
    except:
        log.error('Something went wrong')
    finally:
        db.close_connection(conn)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("username", type=str)
    args = parser.parse_args()

    create_user(args.username)


if __name__ == "__main__":
    main()
