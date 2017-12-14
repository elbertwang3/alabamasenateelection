import sys
import re
import csv
from collections import defaultdict

def main(args):


	file1 = open('data/alabamasenateelection.csv', 'rU')
	csvreader = csv.reader(file1)
	countydict = defaultdict(list)
	contestset = set()
	next(csvreader)
	for row in csvreader:
		countycode = row[2]
		countyname = row[3]
		#print countycode
		#print countyname
		#countydict[countyname].push()
		candidatename = row[7]
		
		contestcode = row[4]
		contestset.add(contestcode)
		if contestcode == '01000900':
			votes = float(row[8])
			countydict[countyname].append(votes)
		#print 'candidatename: ' + str(candidatename)
		#print 'votes: ' + str(votes)
		
	for k,v in countydict.iteritems():
		if len(v) != 3:
			#print "shouldnt be getting here"
			v.append(0)
			#print k,v
		vsum = sum(v)
		v.append(vsum)
		v.append(v[0]/vsum)
		v.append(v[1]/vsum)
		v.append(v[2]/vsum)
	'''for k,v in countydict.iteritems():
		if v[4] > 0.5:
			print k,v'''
	
	file2 = open('data/trumpvotes.csv', 'rU')
	csvreader = csv.reader(file2,delimiter='\t')
	for row in csvreader:
		print row
		trumpvotes = row[1]
		clintonvotes = row[3]
		totalvotes = row[11]
		turnout = float(row[12][0:5])/100
		print trumpvotes
		print clintonvotes
		print totalvotes
		print turnout
	#print contestset

if __name__ == "__main__":
    main(sys.argv[1:])