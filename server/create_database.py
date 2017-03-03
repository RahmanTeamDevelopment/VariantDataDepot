import sys
import sqlite3

conn = sqlite3.connect("variant_depot.db")
cursor = conn.cursor()

cursor.execute("""create table variants (
	id integer primary key,
	submitter text not null,
	sample text not null,
	chrom text not null,
	pos integer not null,
	ref text not null,
	alt text not null,
	gene text not null,
	transcript text not null,
	csn text not null,
	genotype text not null,
	type text not null);""")

conn.commit()
cursor.close()
conn.close()
