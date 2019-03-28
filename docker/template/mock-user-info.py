#!/usr/bin/python

# Ken Bonilla 2019
# After mock-users.js creates the users, this is run to populate some mock
# data for the user_info table.
import psycopg2
import sys

def main():
  conn_string = "host=127.0.0.1 dbname=postgres user=group16 password=abc123 port=5433"
 
  conn = psycopg2.connect(conn_string)
  cursor = conn.cursor()
  record = [];

  for x in range(1, 4):
    arg = "SELECT user_id FROM users WHERE username='user"  + str(x) + "'"
    # print(arg)
    cursor.execute(arg)
    record.append(cursor.fetchone()[0]) 
  
  cursor.execute("""
  INSERT INTO user_info (user_id, first_name, last_name, email_address)
  VALUES (%s, %s, %s, %s);
  """,
  (str(record[0]),"Alice", "Apache", "alice@email.email"))
  
  cursor.execute("""
  INSERT INTO user_info (user_id, first_name, last_name, email_address)
  VALUES (%s, %s, %s, %s);
  """,
  (str(record[1]),"Bob", "Bandit", "bob@email.email"))

  cursor.execute("""
  INSERT INTO user_info (user_id, first_name, last_name, email_address)
  VALUES (%s, %s, %s, %s);
  """,
  (str(record[2]),"Candy", "Comanche", "candy@email.email"))

  cursor.execute("""
  UPDATE users
  SET role_of = %s
  WHERE user_id = %s
  """,
  ("admin", str(record[0])))

  cursor.execute("""
  UPDATE users
  SET role_of = %s
  WHERE user_id = %s
  """,
  ("data-entry", str(record[1])))

  cursor.execute("""
  UPDATE users
  SET role_of = %s
  WHERE user_id = %s
  """,
  ("user", str(record[2])))

  # Commit changes and close
  conn.commit()
  cursor.close()
  conn.close()

if __name__ == "__main__":
	main()
