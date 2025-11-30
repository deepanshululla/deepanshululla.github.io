# Writing your own Web server that can handle multiple connections

**Published:** 2023-01-02

If you are familiar with socket programming, you would be aware that send and recv are usually blocking calls. This means that the code execution will be blocked until they are successfully resolved.

This prevents us from writing TCP servers that can respond to multiple clients. However, there are different ways where we can write our own web server that can handle multiple connections.

## Using select system call

The `.select()` method allows you to check for I/O completion on more than one socket. This enables you to use more than one socket for a port and multiplex connection using the system call.

    
      
        
  
    
    

        

  
  
  
    

    
      This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
      Learn more about bidirectional Unicode characters
    

              Show hidden characters

  
    
    

  
        
          
          import selectors
        
        
          
          import socket
        
        
          
          import types
        
        
          
          

        
        
          
          

        
        
          
          class ServerWithSelect:
        
        
          
              def __init__(self, host_name="localhost", port_num=6379, reuse_port=True):
        
        
          
                  self.host_name = host_name
        
        
          
                  self.port_num = port_num
        
        
          
                  self.reuse_port = reuse_port
        
        
          
                  self.selector = selectors.DefaultSelector()
        
        
          
                  self.__init_server()
        
        
          
          

        
        
          
              def __init_server(self):
        
        
          
                  sock = socket.create_server((self.host_name, self.port_num), reuse_port=self.reuse_port)
        
        
          
                  print(f"Listening on {(self.host_name, self.port_num)}")
        
        
          
                  sock.setblocking(False)
        
        
          
                  self.selector.register(
        
        
          
                      sock, selectors.EVENT_READ, data=None
        
        
          
                  )
        
        
          
          

        
        
          
              def listen_for_connections(self):
        
        
          
                  while True:
        
        
          
                      events = self.selector.select(timeout=None)
        
        
          
                      for key, mask in events:
        
        
          
                          if key.data is None:
        
        
          
                              self.__accept_wrapper(key)
        
        
          
                          else:
        
        
          
                              self.__service_connection(key, mask)
        
        
          
          

        
        
          
              def __accept_wrapper(self, key):
        
        
          
                  sock = key.fileobj
        
        
          
                  print("Listening for Connections")
        
        
          
                  conn, addr = sock.accept()  # wait for client
        
        
          
                  print(f"Connected by {addr}")
        
        
          
                  conn.setblocking(False)
        
        
          
                  data = types.SimpleNamespace(addr=addr, inb=b"", outb=b"")
        
        
          
                  events = selectors.EVENT_READ | selectors.EVENT_WRITE
        
        
          
                  self.selector.register(conn, events, data=data)
        
        
          
          

        
        
          
              def __service_connection(self, key, mask):
        
        
          
                  sock = key.fileobj
        
        
          
                  data = key.data
        
        
          
                  if mask & selectors.EVENT_READ:
        
        
          
                      recv_data = sock.recv(1024)  # Should be ready to read
        
        
          
                      if recv_data:
        
        
          
                          data.outb += recv_data
        
        
          
                      else:
        
        
          
                          print(f"Closing connection to {data.addr}")
        
        
          
                          self.selector.unregister(sock)
        
        
          
                          sock.close()
        
        
          
                  if mask & selectors.EVENT_WRITE:
        
        
          
                      if data.outb:
        
        
          
                          # reply to ping
        
        
          
                          sent = sock.send(b"+PONG\r\n")  # Should be ready to write
        
        
          
                          # sent = self.__reply_to_ping(key)
        
        
          
                          data.outb = data.outb[sent:]
        
        
          
          

        
        
          
              def __del__(self):
        
        
          
                  self.selector.close()
        
        
          
          

        
        
          
          if __name__ == "__main__":
        
        
          
              ServerWithSelect().listen_for_connections()
        
  

    

  

      
      
        view raw
        
          Server_with_select.py
        
        hosted with ❤ by GitHub
      
    

## Server with Threads

Another way to handle multiple client connections is to allocate a single thread to each of the clients.

    
      
        
  
    
    

        

  
  
  
    

    
      This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
      Learn more about bidirectional Unicode characters
    

              Show hidden characters

  
    
    

  
        
          
          import socket
        
        
          
          import threading
        
        
          
          

        
        
          
          

        
        
          
          class ThreadedServer:
        
        
          
              def __init__(self, host_name="localhost", port_num=6379, reuse_port=True):
        
        
          
                  self.host_name = host_name
        
        
          
                  self.port_num = port_num
        
        
          
                  self.reuse_port = reuse_port
        
        
          
                  self.init_server()
        
        
          
          

        
        
          
              def init_server(self):
        
        
          
                  self.socket = socket.create_server((self.host_name, self.port_num), reuse_port=self.reuse_port)
        
        
          
                  # self.socket.setblocking(False) # raises error for some reason
        
        
          
                  print(f"Listening on {(self.host_name, self.port_num)}")
        
        
          
          

        
        
          
              def accept(self):
        
        
          
                  conn, addr = self.socket.accept()
        
        
          
                  # conn.setblocking(False) # raises error for some reason
        
        
          
                  print(f"Connected to {addr}")
        
        
          
                  return conn, addr
        
        
          
          

        
        
          
              def __reply_to_ping(self, conn, addr):
        
        
          
                  while True:
        
        
          
                      try:
        
        
          
                          conn.recv(1024)  # wait for client to send data
        
        
          
                          self.__send(conn, b"+PONG\r\n")
        
        
          
                      except ConnectionError:
        
        
          
                          print(f"Disconnected from {addr}")
        
        
          
                          break  # Stop serving if the client connection is closed
        
        
          
          

        
        
          
              def __send(self, conn, data):
        
        
          
                  conn.sendall(data)
        
        
          
          

        
        
          
              def listen_for_connections(self):
        
        
          
                  while True:
        
        
          
                      conn, addr = self.accept()
        
        
          
                      threading.Thread(target=self.__reply_to_ping, args=(conn, addr,)).start()
        
        
          
          

        
        
          
              def __del__(self):
        
        
          
                  self.socket.close()
        
        
          
                  
        
        
          
          if __name__ == "__main__":
        
        
          
              s = ThreadedServer()
        
        
          
              s.listen_for_connections()
        
  

    

  

      
      
        view raw
        
          threaded_server.py
        
        hosted with ❤ by GitHub
      
    

## 
Async Server with lower level calls

Contrary to popular opinion, IMHO Async is another way of writing multithreaded code. The difference between using threads and async, with threads it is easier to write buggy code. Also, sometimes it is harder to reason. Async makes it relatively easier to write code that can handle concurrent requests.

    
      
        
  
    
    

        

  
  
  
    

    
      This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
      Learn more about bidirectional Unicode characters
    

              Show hidden characters

  
    
    

  
        
          
          import asyncio
        
        
          
          import socket
        
        
          
          from asyncio import AbstractEventLoop
        
        
          
          

        
        
          
          

        
        
          
          class AsyncSocketServer:
        
        
          
              def __init__(self, host_name="localhost", port_num=6379, reuse_port=True):
        
        
          
                  self.host_name = host_name
        
        
          
                  self.port_num = port_num
        
        
          
                  self.reuse_port = reuse_port
        
        
          
                  self.__init_server()
        
        
          
          

        
        
          
              def __init_server(self):
        
        
          
                  self.socket = socket.create_server((self.host_name, self.port_num), reuse_port=self.reuse_port)
        
        
          
                  self.socket.setblocking(False)
        
        
          
                  print(f"Listening on {(self.host_name, self.port_num)}")
        
        
          
          

        
        
          
              async def __reply_to_ping(self, conn, addr, loop: AbstractEventLoop):
        
        
          
                  try:
        
        
          
                      data = b'+PONG\r\n'
        
        
          
                      while await loop.sock_recv(conn, 1024):
        
        
          
                           await loop.sock_sendall(conn, data)
        
        
          
                  except ConnectionError:
        
        
          
                      print(f"Disconnected from {addr}")
        
        
          
                          
        
        
          
          

        
        
          
              async def listen_for_connections(self):
        
        
          
                  while True:
        
        
          
                      loop = asyncio.get_event_loop()
        
        
          
                      conn, addr = await loop.sock_accept(self.socket)
        
        
          
                      # conn.setblocking(False)
        
        
          
                      print(f"Connected to {addr}")
        
        
          
                      asyncio.create_task(self.__reply_to_ping(conn, addr, loop))
        
        
          
          

        
        
          
              def __del__(self):
        
        
          
                  self.socket.close()
        
        
          
                  
        
        
          
           
        
        
          
          if __name__ == "__main__":
        
        
          
              s = AsyncSocketServer()
        
        
          
              asyncio.run(s.listen_for_connections())
        
  

    

  

      
      
        view raw
        
          async_socket_server.py
        
        hosted with ❤ by GitHub
      
    

## Async Server with higher level calls

This is the same as above, except this uses more convenient high level functions as opposed to using lower level socket APIs.

    
      
        
  
    
    

        

  
  
  
    

    
      This file contains hidden or bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.
      Learn more about bidirectional Unicode characters
    

              Show hidden characters

  
    
    

  
        
          
          import asyncio
        
        
          
          

        
        
          
          class AsyncIOServer:
        
        
          
              def __init__(self, host_name="localhost", port_num=6379, reuse_port=True):
        
        
          
                  self.host_name = host_name
        
        
          
                  self.port_num = port_num
        
        
          
                  self.reuse_port = reuse_port
        
        
          
          

        
        
          
          

        
        
          
              async def __start_server(self):
        
        
          
                  self.server = await asyncio.start_server(self.__handle_connection,
        
        
          
                                                           self.host_name,
        
        
          
                                                           self.port_num,
        
        
          
                                                           reuse_port=True)
        
        
          
                  async with self.server:
        
        
          
                      await self.server.serve_forever()
        
        
          
                      print(f"Listening on {self.host_name}:{self.port_num}")
        
        
          
          

        
        
          
              async def __handle_connection(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
        
        
          
                  addr = writer.get_extra_info('peername')
        
        
          
                  print(f"Connected to {addr}")
        
        
          
                  while True:
        
        
          
                      try:
        
        
          
                          request = await reader.read(1024)
        
        
          
                          # request_msg = request.decode().strip()
        
        
          
                          response = "+PONG\r\n"
        
        
          
                          writer.write(response.encode())
        
        
          
                          await writer.drain()
        
        
          
                      except Exception as e:
        
        
          
                          print(f"Disconnected from {addr}")
        
        
          
                          break
        
        
          
          

        
        
          
              async def listen_for_connections(self):
        
        
          
                  await self.__start_server()
        
        
          
          

        
        
          
          if __name__ == "__main__":
        
        
          
               s = AsyncIOServer()
        
        
          
               asyncio.run(s.listen_for_connections())
        
  

    

  

      
      
        view raw
        
          async_io_server.py
        
        hosted with ❤ by GitHub
      
    

I hope you found this helpful. In case you know of another way please do leave a comment.