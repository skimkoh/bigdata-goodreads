import boto3
import json
import time
from botocore.exceptions import ClientError 
import argparse
 
def create_security_group(security_group_name):
    ec2 = boto3.client('ec2')
    response = ec2.describe_vpcs()
    vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')
    try:
        response = ec2.create_security_group(GroupName=security_group_name,
                                            Description='DESCRIPTION',
                                            VpcId=vpc_id)
        security_group_id = response['GroupId']
        print('Security Group Created %s in vpc %s.' % (security_group_id, vpc_id))
    except ClientError as e:
         print(e)
         return
    data = ec2.authorize_security_group_ingress(
        GroupId=security_group_id,
        IpPermissions=[
            {'IpProtocol': 'tcp',
             'FromPort': 0,
             'ToPort': 65535,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
        ])
    print('Ingress Successfully Set %s' % data)
 
 

def create_ec2_instances(security_group_name):
    ec2 = boto3.resource('ec2')

    #create 4 ec2 instances for production system
    res = ec2.create_instances(
        ImageId='ami-061eb2b23f9f8839c',
        MinCount=args.number_of_instances,
        MaxCount=args.number_of_instances,
        InstanceType=args.instance_type,
        KeyName=args.keypair,
        SecurityGroups=[security_group_name]
    )
    ec2_id_list = []
    for i in res:
        ec2_id_list.append(i.instance_id)
    
    ec2_instances["master"] = ec2_id_list[0]
    ec2_instances["slaves"] = []
    for i in range(1, len(ec2_id_list)):
        ec2_instances['slaves'].append(ec2_id_list[i])

    
    print(ec2_id_list)
    print(ec2_instances)
    print("Waiting for instances to be ready")
    
    client = boto3.client('ec2')    
    #wait for all instances to be running
    waiter = client.get_waiter('instance_running')
    waiter.wait(
    InstanceIds=ec2_id_list,
    WaiterConfig={
        'Delay': 5,
        'MaxAttempts': 50
    }
    )  
    
    print("instances are running")
    
    # Obtain public dns of the newly created instances
    running_instances = ec2.instances.filter(Filters=[{
    'Name': 'instance-state-name',
    'Values': ['running']}])
    for instance in running_instances:
        if instance.instance_id == ec2_instances["master"]:
            ec2_public_dns["master"] = instance.public_dns_name
        elif instance.instance_id in ec2_instances["slaves"]:
            ec2_public_dns["slaves"].append(instance.public_dns_name)



def write_to_file(ec2_public_dns):
    with open("masternode_publicDNS.txt", "w") as outputFile:
        master_dns = ec2_public_dns["master"]
        outputFile.write(f"{master_dns}")

    with open("datanodes_publicDNS.txt", "w") as outputFile:
        for slave_dns in ec2_public_dns["slaves"]:
            outputFile.write(f"{slave_dns}\n")




    

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-k', type=str, dest='keypair', required=True, help='enter filepath to ec2 keypair')
    parser.add_argument('-n', type=int, dest='number_of_instances', required=True, help='enter number of nodes')
    parser.add_argument('-t', type=str, dest='instance_type', required=True, help='enter instance type')
    args = parser.parse_args()
    
    SECURITY_GROUP_NAME = "AnalyticsSystem"

    create_security_group(SECURITY_GROUP_NAME)
    ec2_instances = {}
    ec2_public_dns = {}
    ec2_public_dns["slaves"] = []
    create_ec2_instances(SECURITY_GROUP_NAME)
    write_to_file(ec2_public_dns)
    print(ec2_public_dns)
    print("wait for 20 seconds for instances to be ready")
    time.sleep(20)

