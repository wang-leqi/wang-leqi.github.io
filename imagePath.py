#coding=utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
import exifread
import os
# print os.getcwd()
# print os.listdir(os.getcwd())

file_name = []
lista = os.listdir('.')
# print lista

for a in lista:
	if not os.path.isdir(a):
		file_name.append(os.path.join(os.getcwd(),a))
	else:
		listb = os.listdir(os.path.join(os.getcwd(),a))
		for b in listb:
			# print listb
			if not os.path.isdir(os.path.join(os.path.join(os.getcwd(),a),b)):
				# print b
				file_name.append(os.path.join(os.path.join(os.getcwd(),a),b))
			else:
				listc = os.listdir(os.path.join(os.path.join(os.getcwd(),a),b))
				for c in listc:
					if not os.path.isdir(os.path.join(os.path.join(os.path.join(os.getcwd(),a),b),c)):
						# print c
						file_name.append(os.path.join(os.path.join(os.path.join(os.getcwd(),a),b),c))
					else:
						listd = os.listdir(os.path.join(os.path.join(os.path.join(os.getcwd(),a),b),c))
						for d in listd:
							if not os.path.isdir(os.path.join(os.path.join(os.path.join(os.path.join(os.getcwd(),a),b),c),d)):
									# print d
								file_name.append(os.path.join(os.path.join(os.path.join(os.path.join(os.getcwd(),a),b),c),d))
							else:
								liste =os.listdir(os.path.join(os.path.join(os.path.join(os.path.join(os.getcwd(),a),b),c),d))
								for e in liste:
									if not os.path.isdir(e):
										file_name.append(e)

print len(file_name)
number = 1
for files in file_name[:]:
	f = open(files.decode('utf-8'),'rb')
	datas = exifread.process_file(f)
 	f.close()
 	# print '/'.join(files.split('/')[6:])
	cate = ''
 	name = ''
 	path = ''
 	if len(files.split('/')) >= 10:
	 	cate = files.split('/')[7]
	 	name = files.split('/')[8]
	 	# path = files
	 	pathabs = '/'.join(files.split('/')[5:10])

	 	print pathabs


	 	wenjianming_noPath,wenjinanhouzhui = os.path.splitext(files)
	 	wenjianming = os.path.basename(files)

	 	attributes = ''
	 	attributes_1 = ''  
	 	if wenjinanhouzhui.lower() == '.jpg' or wenjinanhouzhui.lower() == '.cr2':
	 		if datas.has_key('EXIF DateTimeOriginal'):
	 			attributes = datas['EXIF DateTimeOriginal']
	 			# print attributes
 			if datas.has_key('Image DateTime'):
 				attributes_1 = datas['Image DateTime']
 				# print attributes_1

		with open('infoOfBird1.csv','a') as fopen: 
			if attributes:
				fopen.write(str(number) + ',' + cate + ',' + name + ',' + pathabs + ',' + str(attributes) + '\n')
				print '%s and MakerNote OwnerName write done!'%(wenjianming)
				number = number + 1
				continue
			elif attributes_1:
				fopen.write(str(number) + ',' + cate + ',' + name + ',' + pathabs + ',' + str(attributes_1) + '\n')
				print '%s and MakerNote OwnerName write done!'%(wenjianming)
				number = number + 1
				continue
			else:
				fopen.write(str(number) + ',' + cate + ',' + name + ',' + pathabs  + ',' + 'NULL' + '\n')
				print '%s and NULL write done!'%(wenjianming)
				number = number + 1



