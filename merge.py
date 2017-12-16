import sys
import re
import csv
import operator
from collections import defaultdict

def main(args):


	file1 = open('data/alabamasenateelection.csv', 'rU')
	csvreader = csv.reader(file1)
	countydict = defaultdict(list)
	contestset = set()
	next(csvreader)
	countynamecodedict = defaultdict(str)
	for row in csvreader:
		countycode = row[2]
		countyname = row[3]
		countynamecodedict[countyname] = countycode
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
		#print row
		county = row[0]
		trumpvotes = float(row[1].replace(',',''))
		trumppercent = float(row[2][:-1])/100
		clintonvotes = float(row[3].replace(',',''))
		clintonpercent = float(row[4][:-1])/100
		totalvotes = float(row[11].replace(',',''))
		turnout = float(row[12][:-1])/100
		#print trumpvotes
		#print clintonvotes
		#print totalvotes
		#print turnout
		countydict[county].append(clintonvotes)
		countydict[county].append(trumpvotes)
		countydict[county].append(totalvotes)
		countydict[county].append(clintonpercent)
		countydict[county].append(trumppercent)
		countydict[county].append(turnout)
	for k,v in countydict.iteritems():
		if len(v) != 13:
			print 'shouldnt be getting here'
	print len(countydict)
	file2 = open('data/ALVR-2016.csv', 'rU')
	csvreader = csv.reader(file2)
	next(csvreader)
	next(csvreader)
	next(csvreader)
	for row in csvreader:
		county = row[0].lower().title()
		if county == 'Dekalb':
			county = 'DeKalb'
		total = float(row[1].strip().replace(',',''))
		blackactive = float(row[4].strip().replace(',',''))
		blackinactive = float(row[14].strip().replace(',',''))
		whiteactive = float(row[8].strip().replace(',',''))
		whiteinactive = float(row[18].strip().replace(',',''))
		#print county
		#print total
		#print blackactive
		#print blackinactive
		#print whiteactive
		#print whiteinactive
		black = blackactive + blackinactive
		white = whiteactive + whiteinactive
		percentwhite = white/total
		percentblack = black/total
		
		countydict[county].append(black)
		countydict[county].append(white)
		countydict[county].append(total)
		countydict[county].append(percentblack)
		countydict[county].append(percentwhite)
		
	
	file2 = open('data/ALVR-2017.csv', 'rU')
	csvreader = csv.reader(file2)
	next(csvreader)
	next(csvreader)
	next(csvreader)
	for row in csvreader:
		county = row[0].lower().title()
		if county == 'Dekalb':
			county = 'DeKalb'
		total = float(row[1].strip().replace(',',''))
		blackactive = float(row[4].strip().replace(',',''))
		blackinactive = float(row[14].strip().replace(',',''))
		whiteactive = float(row[8].strip().replace(',',''))
		whiteinactive = float(row[18].strip().replace(',',''))
		black = blackactive + blackinactive
		white = whiteactive + whiteinactive
		percentwhite = white/total
		percentblack = black/total
		
		countydict[county].append(black)
		countydict[county].append(white)
		countydict[county].append(total)
		countydict[county].append(percentblack)
		countydict[county].append(percentwhite)

		'''if percentwhite > 0.9:
			print county'''
	
	
	file2 = open('data/ALcountiesbyincome.csv', 'rU')
	csvreader = csv.reader(file2)
	next(csvreader)
	for row in csvreader:
		county = row[1].rsplit(' ', 1)[0]
		income = float(row[3])
		#print income
		
		countydict[county].append(income)

	for k,v in countydict.iteritems():
		#print k
		countyvoters = v[3]
		totalregisteredvoters = v[20]
		turnout = countyvoters / totalregisteredvoters
		#print countyvoters
		#print totalregisteredvoters
		#print turnout
		v.append(turnout)
		
	turnoutdiffdict = defaultdict(int)
	flipflopdict = defaultdict(int)
	for k,v in countydict.iteritems():
		difference = v[12]-v[24]
		county = k
		turnoutdiffdict[county] = difference

		jonespercent = v[4]
		moorepercent = v[5]
		clintonpercent = v[10]
		trumppercent = v[11]
		#print k
		#print jonespercent
		#print moorepercent
		#print clintonpercent
		#print trumppercent
		'''if trumppercent > clintonpercent and jonespercent > moorepercent:
			print k'''
	file2 = open('data/alabamareligion.csv', 'rU')
	csvreader = csv.reader(file2)
	next(csvreader)
	countyset = set()
	for row in csvreader:
		state = row[564]
		
		if state != 'Alabama':
			break
		population = float(row[567])
		county = row[566].rsplit(' ', 1)[0]
		countyset.add(county)
		#print county
		evangelicals = float(row[4])
		#print evangelicals
		evangelicalrate = evangelicals/population
		#print evangelicalrate
		countydict[county].append(evangelicalrate)
	
	file2 = open('data/fipscodes.csv')
	csvreader = csv.reader(file2,delimiter='\t')
	for row in csvreader:
		fipscode = str(row[0])
		county = row[1]
		countydict[county].append(fipscode)
		#print len(countydict[county])

	
	
	file2 = open('data/fullalabamadata.csv', 'a')
	csvwriter = csv.writer(file2)
	for k,v in countydict.iteritems():
		v.append(k)
		csvwriter.writerow(v)
	

		
		
		#break


			
	
	
	sorteddict = sorted(turnoutdiffdict.items(), key=operator.itemgetter(1),reverse=True)
	#print sorteddict[:10]


	

	

if __name__ == "__main__":
    main(sys.argv[1:])