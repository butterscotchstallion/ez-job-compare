import sqlite3
import logging as log

class DbUtils:

    def connect_db(self, dbPath):
        try:
            with sqlite3.connect(dbPath) as conn:
                if conn:
                    conn.row_factory = sqlite3.Row
            return conn
        except e:
            log.error('Error connecting: {}'.format(e))


    def close_connection(self, connection):
        if connection:
            connection.close()


    def get_list_from_rows(self, cursor):
        results = []

        try:
            columns = [column[0] for column in cursor.description]

            for row in cursor.fetchall():
                results.append(dict(zip(columns, row)))

            return results
        except:
            log.error('Error in get_list_from_rows')
        finally:
            return results
