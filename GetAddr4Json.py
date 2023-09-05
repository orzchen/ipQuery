import re
import socket
import json

# 打开JSON文件以供读取
with open('IPv4.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
print('json'+str(len(data)))
# 打开要查询的IP列表
with open("res_ip_noport.txt", 'r') as file:
    lines = file.readlines()
print('ip'+str(len(lines)))
ip_addr = {}
pattern = r'.*Failed.*'
# 输出
with open("./addrs.txt","w+") as f:
	# 遍历每一行
	for line in lines:
		for d in data :
			if d["ip"]+'\n'==line:
				ip_addr[line] = d["Country"]
				f.write(d["Country"]+'\n')
				break
			
print(len(ip_addr))