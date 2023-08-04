from  threads import  Threads

def threadsByUser(username, cantidadThreads):
    threads = Threads()

    user_id = threads.public_api.get_user_id(username=username)
    print("ID del usuario: ",user_id)

    user_threads = threads.public_api.get_user_threads(id=user_id)

    Respuesta = []
    for i in (range(0,cantidadThreads)):
        try: #Maneja los threads
            if(user_threads["data"]["mediaData"]["threads"][i]["thread_items"][0]["post"]["text_post_app_info"]["share_info"]["reposted_post"]!=None):
                Respuesta.append({"text":user_threads["data"]["mediaData"]["threads"][i]["thread_items"][0]["post"]["text_post_app_info"]["share_info"]["reposted_post"]["caption"]["text"]})
            else: #Maneja los rethreads
                Respuesta.append({"text":user_threads["data"]["mediaData"]["threads"][i]["thread_items"][0]["post"]["caption"]["text"]})
        except: 
            continue

    return Respuesta