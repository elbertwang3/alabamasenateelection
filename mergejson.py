import json
import sys
import csv
from pprint import pprint
from collections import defaultdict
def main(args):
	file1 = open('data/fullalabamadata.csv')
	csvreader = csv.reader(file1)
	headernames = next(csvreader)
	#print headernames
	csvdict = defaultdict(list)
	for row in csvreader:
		#print len(row)
		geoid = row[26]
		#print geoid
		csvdict[geoid].extend(row)


		
	with open('alabama/alabama.json') as data_file:    
		data = json.load(data_file)
		#pass


	#print pprint(data['features'][0]['properties'])
	tomodify = data['features']
	for i in range(len(tomodify)):
		properties = tomodify[i]['properties']
		geoid = properties['GEOID']
		#print geoid
		for j in range(len(headernames)):
			
			properties[headernames[j]] = csvdict[geoid][j]
		#print properties
	with open('alabama/mergedalabama.json', 'w') as fp:
		json.dump(data, fp)
if __name__ == "__main__":
	main(sys.argv)