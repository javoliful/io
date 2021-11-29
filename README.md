# smartvideo-io

Server responsible for notifying clients about events.

## Usage

In order to install all the this service for the video chat, you can just use the makefile in this folder:

```
> make
 **************************************************************************************** 
 *************************************** Video Chat POC ********************************* 
 **************************************************************************************** 
 *											*
 * Usage:										*
 *											*
 * 	* make | make help -> Show this display						*
 * 	* make build -> Build locally all needed docker images 				*
 *	* make install -> Install all the microservices					*
 *	* make reinstall -> Reinstall all the microservices				*
 *	* make uninstall -> Uninstall all the microservices				*
 *	* make run -> Run locally the socket.io back in port PORT=3000 			*
 *											*
 **************************************************************************************** 
 *************************************** \Video Chat POC ******************************** 
 **************************************************************************************** 
```

If you prefer to run them without the docker swarm infrastructure, you could just run both servers in two different consoles with:

Same than `make run`:
```
docker run -p 3000:3000 hub.aareonit.fr:5000/preprod/smartvideo-io:local
```

And you will have: 
* http://localhost:3000 -> smartvideo-io
