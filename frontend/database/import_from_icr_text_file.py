import sys
import psycopg2

conn = psycopg2.connect("dbname=variant_depot user=andy")
cursor = conn.cursor()

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
                "values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                ("rahmanlab", sample, "chr1", 1000, "A", "T", gene, transcript, csn, genotype, var_type)
            )
        except:
            print line
            raise

conn.commit()
cursor.close()
conn.close()
