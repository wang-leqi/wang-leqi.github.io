import os
file_path = 'infoOfBirds_new_sorted.csv'
fopen = open(file_path)
lines = fopen.readlines()
fopen.close()
with open('infoOfBirds_new_sorted_rep.csv', 'w') as fopen:
	for line in lines:
		n_line = line.replace('CR2', 'jpg')
		fopen.write(n_line)