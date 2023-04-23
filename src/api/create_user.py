import argparse
import secrets
import string


def generate_password():
    # 20 character password
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(20))
    return password


def create_user(username):
    pass


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("username", type=string)
    args = parser.parse_args()
