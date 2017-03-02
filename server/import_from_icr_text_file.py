import sys
import sqlite3

conn = sqlite3.connect("variant_depot.db")
cursor = conn.cursor()

cursor.execute("""create table variants (
	id serial primary key,
	submitter varchar(50) not null,
	sample varchar(50) not null,
	chrom varchar(20) not null,
	pos integer not null,
	ref varchar(20) not null,
	alt varchar(20) not null,
	gene varchar(30) not null,
	transcript varchar(30) not null,
	csn varchar(50) not null,
	genotype varchar (3) not null,
	type varchar(20) not null);""")


with open(sys.argv[1], 'r') as input_file:
    for index,line in enumerate(input_file):
        if index == 0:
            continue
        cols = line.strip().split("\t")
        sample,gene,csn,genotype,flag,var_type,transcript = cols

        if index % 1000 == 0:
            print index, line

        try:
            cursor.execute(
                "insert into variants"
                "(submitter, sample, chrom, pos, ref, alt, gene, transcript, csn, genotype, type)"
                "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ("rahmanlab", sample, "chr1", 1000, "A", "T", gene, transcript, csn, genotype, var_type)
            )
        except:
            print line
            raise

conn.commit()
cursor.close()
conn.close()
