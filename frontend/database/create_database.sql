
create table variants (
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
	type varchar(20) not null);
