###############################################################################
#	Description
#	pass.sh generates public/private keys for ssh and add it to remote server
#	so that you do not need to type password when trying to login to that server.
#	Usage
#	pass.sh $option $username/$remote_server
#	To generate public/private keys: pass.sh keygen username@zynga.com (only once)
#	To add key to remote server: pass.sh update dev2-exampleville.zc2.zynga.com
###############################################################################
case "$1" in
		"keygen")
		ssh-keygen -t rsa -C $2
		;;
		"update")
		ssh $2 "mkdir -p ~/.ssh;chmod 700 ~/.ssh;touch ~/.ssh/authorized_keys;echo `cat ~/.ssh/id_rsa.pub` >> ~/.ssh/authorized_keys"
		ssh $2 "echo SUCCESS"
		;;
esac