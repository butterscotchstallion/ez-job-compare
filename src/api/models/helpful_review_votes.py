import logging as log
import sqlite3
from util import DbUtils

db = DbUtils()
log.basicConfig(level=log.INFO)


class HelpfulReviewVotes:
    """Handles votes on employer reviews"""

    def add_helpful_vote(self, review_id, user_id):
        conn = None
        try:
            conn = db.connect_db()
            query = '''
                INSERT INTO helpful_review_votes(review_id, user_id)
                VALUES(?, ?)
            '''
            conn.execute(query, (review_id, user_id))
            conn.commit()
            return {
                'status': 'OK',
                'message': 'Vote recorded'
            }
        except sqlite3.Error as er:
            log.error('add_helpful_vote error: %s' % er)
        finally:
            db.close_connection(conn)

    def get_has_voted_map(self, votes):
        vote_map = {}

        for vote in votes:
            user_id = vote['userId']
            if user_id not in vote_map:
                vote_map[user_id] = []
            vote_map[user_id].append(vote)

        return vote_map

    def get_review_votes_map(self, votes):
        vote_map = {}

        for vote in votes:
            review_id = vote['reviewId']
            if review_id not in vote_map:
                vote_map[review_id] = []
            vote_map[review_id].append(vote)

        return vote_map

    def get_votes_by_employer_slug(self, employer_slug):
        conn = None
        try:
            conn = db.connect_db()
            query = '''
                SELECT  v.user_id AS userId,
                        v.review_id as reviewId,
                        e.id AS employerId
                FROM helpful_review_votes v
                JOIN reviews r ON r.id = v.review_id
                JOIN employers e ON e.id = r.employer_id
                WHERE 1=1
                AND e.slug = ?
            '''
            cursor = conn.execute(query, (employer_slug,))
            results = db.get_list_from_rows(cursor)
            return {
                'status': 'OK',
                'results': results
            }
        except sqlite3.Error as er:
            log.error('get_votes_by_employer_id error: %s' %
                      (' '.join(er.args)))
        finally:
            db.close_connection(conn)
