from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime

from firebase_admin import db

class LandingAPI(APIView):
    
    name = 'Landing API'

    # Coloque el nombre de su colección en el Realtime Database
    collection_name = 'Albumes'

    def post(self, request):
	        
        # Referencia a la colección
        ref = db.reference(f'{self.collection_name}')

        current_time  = datetime.now()
        custom_format = current_time.strftime("%d/%m/%Y, %I:%M:%S %p").lower().replace('am', 'a. m.').replace('pm', 'p. m.')
        request.data.update({"saved": custom_format })
        
        # push: Guarda el objeto en la colección
        new_resource = ref.push(request.data)
        
        # Devuelve el id del objeto guardado
        return Response({"id": new_resource.key}, status=status.HTTP_201_CREATED)
    

    def get(self, request):

        # Referencia a la colección
        ref = db.reference(f'{self.collection_name}')
        
        # get: Obtiene todos los elementos de la colección
        data = ref.get()

        # Devuelve un arreglo JSON
        return Response(data, status=status.HTTP_200_OK)

# Importaciones Django Rest Framework (DRF)
# from django.shortcuts import get_object_or_404

# class LandingAPIDetail(APIView):

#     name = 'Landing Detail API'
#     collection_name = 'Albumes'

#     def get(self, request, pk):

#         # Referencia a la colección
#         ref = db.reference(f'{self.collection_name}')
#         documento = ref.get()

#         if documento:
#             return Response(documento, status=status.HTTP_200_OK)
#         else:
#             return Response(
#                 {"error": "Documento no encontrado!!!"},
#                 status=status.HTTP_404_NOT_FOUND
#             )
        
#     def put(self, request, pk):

#         # Referencia a la colección
#         ref = db.reference(f'{self.collection_name}')
#         documento = ref.get()

#         if not documento:
#             return Response({"error": "Documento no encontrado"}, status=status.HTTP_404_NOT_FOUND)

#         # Validar los datos de entrada
#         required_fields = ["band", "link", "portada", "year"]  # Campos Albumes
#         missing_fields = [field for field in required_fields if field not in request.data]

#         if missing_fields:
#             return Response(
#                 {"error": f"Faltan los campos requeridos: {', '.join(missing_fields)}"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # Actualizar el documento en Firebase
#         ref.update(request.data)

#         return Response(None, status=status.HTTP_200_OK)

#     def delete(self, request, pk):

#         # Referencia a la colección
#         ref = db.reference(f'{self.collection_name}/{pk}')
#         documento = ref.get()
        
#         if not documento:
#             return Response(
#                 {"error": "Documento no encontrado"},
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         # Eliminar el documento
#         ref.delete()
        
#         return Response(
#                 {"message": "Documento eliminado exitosamente"},
#                 status=status.HTTP_204_NO_CONTENT
#             )