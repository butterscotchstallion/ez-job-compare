'''
CLI utility to create users
'''
import argparse
import secrets
import string
from db import DbUtils
import logging as log
import sqlite3
import bcrypt
log.basicConfig(level=log.INFO)


def generate_password():
    # 20 character password
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(20))
    return password

def get_hashed_password(plain_text_password):
    # Hash a password for the first time
    #   (Using bcrypt, the salt is saved into the hash itself)
    return bcrypt.hashpw(plain_text_password, bcrypt.gensalt())

def check_password(plain_text_password, hashed_password):
    # Check hashed password. Using bcrypt, the salt is saved into the hash itself
    return bcrypt.checkpw(plain_text_password, hashed_password)

def user_exists(username):
    db = DbUtils()
    try:
        conn = db.connect_db()
        query = '''
            SELECT COUNT(*) AS userCount
            FROM users u
        '''
        cursor = conn.execute(query)
        results = db.get_list_from_rows(cursor)
        user_count = results[0]['userCount']
        return user_count > 0
    except sqlite3.Error as er:
        log.error('user_exists error: %s' % (' '.join(er.args)))
    finally:
        db.close_connection(conn)


def create_user(username):
    db = DbUtils()
    try:
        conn = db.connect_db()
        if not user_exists(username):
            query = '''
                INSERT INTO users(name, password)
                VALUES(?, ?)
            '''
            generated_password = generate_password()
            hashed = get_hashed_password(generated_password)
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