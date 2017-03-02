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
    num_vars = json.loads(num_vars_response.data)['num_variants']
    return render_template("index.html", num_vars=num_vars)


@application.route('/num_variants')
def num_variants():
    cur = get_db()
    cur.execute('select count(chrom) from variants')
    result = cur.fetchone()
    num_variants = result[0]
    return jsonify({"num_variants": num_variants})


@application.route('/variant/<csn>')
def show_single_variant(csn):
    cur = get_db()
    cur.execute(
        'select * from variants where csn = %s', (csn,)
    )

    vardata = cur.fetchone()
    return jsonify(vardata)


@application.route('/upload_variants', methods=['GET'])
def upload_variants():
    return render_template('upload_variants.html')


@application.route('/variants_by_freq', methods=['GET'])
def variants_by_freq():
    return render_template('variants_by_freq.html')


@application.route('/variants_by_csn', methods=['GET'])
def variant_by_csn():
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
    #return render_template('show_variants.html', variants=variants)


if __name__ == "__main__":
    application.debug = True
    application.run()
