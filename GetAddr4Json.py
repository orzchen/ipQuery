import re
import socket
import json

# 保存地址的文件 IP文件和地址文件就是一行一行对应的
out_addr = "./addrs.txt"

# 打开JSON文件以供读取
with open('IPv4.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
dataIP = [d['ip'] for d in data]

print('json: '+str(len(data)))

ipList = []
with open("C:/Users/iCHEN/Desktop/IPAddr/IP.txt", 'r') as file:
    lines = file.readlines()
    for line in lines:
    	ipList.append(str(line).strip())

print('ip数: '+str(len(ipList)))


ip_addr = {}
fail_count = 0
succ_count = 0
with open(out_addr,"w+") as f:
	# 遍历每一行
	for line in ipList:
		if line in dataIP:
			for d in data :
				if d["ip"] ==line:
					ip_addr[line] = d["Country"]
					f.write(d["Country"]+'\n')
					succ_count = succ_count + 1
					break
		else:
			f.write("Failed\n")
			fail_count = fail_count + 1

		
# print("查询到IP地址{0}条".format(len(ip_addr)))
print("查询到IP地址{0}条".format(succ_count))
print("查询失败{0}条".format(fail_count))