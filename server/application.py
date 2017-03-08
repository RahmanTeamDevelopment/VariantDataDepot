import json
import os
import sqlite3

from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, jsonify


application = Flask(__name__)
application.config.from_object(__name__)

application.config.update(dict(
    DATABASE="variant_depot.db",
    USERNAME='andy',
))

application.config.from_envvar('FLASKR_SETTINGS', silent=True)


def get_vcf_info_value(info_field, key):
    for key_val in info_field.split(";"):
        this_key,val = key_val.split("=", 1)
        if this_key == key:
            return val


def add_variants_from_vcf_to_database(the_file):
    cursor = get_db()
    num_vars = 0

    for index,line in enumerate(the_file):
        if line.startswith("##"):
            continue
        elif line.startswith("#"):
            sample = line.split("\t")[9]
            continue
        else:
            cols = line.strip().split("\t")
            chrom,pos,the_id,ref,alt,qual,the_filter,info,the_format,sample_data = cols[0:10]
            gene = get_vcf_info_value(info, "GENE")
            transcript = get_vcf_info_value(info, "ENST")
            csn = get_vcf_info_value(info, "CSN")
            genotype = sample_data.split(":")[0]
            var_type = get_vcf_info_value(info, "CLASS")

            if index % 100000 == 0:
                print index, line
                print "\n\nSample is {}\n\n".format(sample)

            cursor.execute(
                "insert into variants"
                "(submitter, sample, chrom, pos, ref, alt, gene, transcript, csn, genotype, type)"
                "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ("rahmanlab", sample, chrom, pos, ref, alt, gene, transcript, csn, genotype, var_type)
            )
            num_vars += 1

    g.db.commit()
    return num_vars


def add_variants_from_txt_to_database(the_file):
    cursor = get_db()
    num_vars = 0

    for index,line in enumerate(the_file):
        if index == 0:
            continue

        cols = line.strip().split("\t")
        sample,gene,csn,genotype,flag,var_type,transcript = cols

        if index % 1000 == 0:
            print index, line

        cursor.execute(
            "insert into variants"
            "(submitter, sample, chrom, pos, ref, alt, gene, transcript, csn, genotype, type)"
            "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            ("rahmanlab", sample, "NA", "NA", "NA", "NA", gene, transcript, csn, genotype, var_type)
        )

        num_vars += 1

    g.db.commit()
    return num_vars


def connect_db():
    conn = sqlite3.connect(application.config['DATABASE'])
    return conn


def get_db():
    """
    Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(g, 'db'):
        g.db = connect_db()

    return g.db.cursor()


@application.teardown_appcontext
def close_db(error):
    if hasattr(g, 'db'):
        g.db.close()


@application.route('/')
def home():
    num_vars_response = num_variants()
    num_samples_response = num_samples()
    number_of_vars = json.loads(num_vars_response.data)['num_variants']
    number_of_samples = json.loads(num_samples_response.data)['num_samples']
    return render_template("index.html", num_vars=number_of_vars, num_samples=number_of_samples)


@application.route('/num_variants')
def num_variants():
    cur = get_db()
    cur.execute('select count(chrom) from variants')
    result = cur.fetchone()
    num_variants = result[0]
    return jsonify({"num_variants": num_variants})


@application.route('/num_samples')
def num_samples():
    cur = get_db()
    cur.execute('select count(distinct sample) from variants')
    result = cur.fetchone()
    num_variants = result[0]
    return jsonify({"num_samples": num_variants})


@application.route('/variant/<csn>')
def show_single_variant(csn):
    cur = get_db()

    if request.args.get('gene') is None:

    cur.execute(
        'select * from variants where csn = ?', (csn,)
    )

    vardata = cur.fetchone()
    return jsonify(vardata)


@application.route('/variants_by_gene/<gene>')
def variants_by_gene(gene):
    cur = get_db()

    if request.args.get('type') is not None:
        impact_type = request.args.get('type')
        cur.execute(
            'select * from variants where gene = ? and type = ?', (gene,impact_type)
        )
    else:
        cur.execute(
            'select * from variants where gene = ?', (gene,)
        )

    return jsonify(cur.fetchall())


@application.route('/upload_variants', methods=['GET', 'POST'])
def upload_variants():
    if request.method == 'POST':
        the_file = request.files['file']
        if the_file.filename.endswith("vcf"):
            num_vars = add_variants_from_vcf_to_database(the_file)
        elif the_file.filename.endswith("txt"):
            num_vars = add_variants_from_txt_to_database(the_file)
        else:
            return jsonify("Error: unknown file-type for file {}. Extension must be .vcf or .txt".format(the_file.filename))

        return render_template('upload_variants.html', num_vars=num_vars)

    return render_template('upload_variants.html', num_vars=0)


@application.route('/variants_by_csn', methods=['GET', 'POST'])
def variant_by_csn():
    if request.method == 'POST':
        csn = request.form['csn']
        cursor = get_db()
        cursor.execute(
            'select submitter,sample,csn,gene,transcript,genotype from variants where csn = ? order by chrom,pos asc',
            (csn,)
        )

        return render_template('variant_table.html', variants=cursor.fetchall())

    return render_template('variants_by_csn.html')


@application.route('/variants_by_pos', methods=['GET', 'POST'])
def variant_by_pos():
    if request.method == 'POST':
        chrom = request.form['chrom']
        start_pos = request.form['start_pos']
        end_pos = request.form['end_pos']

        cursor = get_db()
        cursor.execute(
            'select submitter,sample,csn,gene,transcript,genotype from variants where chrom = ? and pos >= ? and pos <= ? order by chrom,pos asc',
            (chrom, start_pos, end_pos)
        )

        return render_template('variant_table.html', variants=cursor.fetchall())

    return render_template('variants_by_pos.html')


@application.route('/variants')
def show_variants():
    cur = get_db()
    cur.execute(
        'select chrom,pos,ref,alt from variants order by chrom,pos asc limit 10'
    )

    variants = []
    for index,(chrom,pos,ref,alt) in enumerate(cur.fetchall()):
        variants.append( (index, chrom, pos, ref, alt) )

    return jsonify(variants)


if __name__ == "__main__":
    application.debug = True
    application.run()
