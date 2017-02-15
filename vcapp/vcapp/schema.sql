drop table if exists variants;

create table variants (
  id integer primary key autoincrement,
  chrom text not null,
  pos integer not null,
  ref text not null,
  alt tex not null
);
