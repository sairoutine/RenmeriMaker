cd `dirname $0`
mysql -uroot -hlocalhost -P3306 -e 'drop database renmeri_maker;'
mysql -uroot -hlocalhost -P3306 -e 'create database renmeri_maker;'
go run ./migrate_db.go
