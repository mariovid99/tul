import os

# Ruta de la carpeta donde están las imágenes
carpeta = "stickers"

# Obtener la lista de archivos en la carpeta
archivos = os.listdir(carpeta)

# Filtrar solo archivos de imagen (puedes agregar más extensiones si es necesario)
extensiones_permitidas = [".png", ".jpg", ".jpeg", ".gif"]
archivos_imagen = [archivo for archivo in archivos if os.path.splitext(archivo)[1].lower() in extensiones_permitidas]

# Renombrar los archivos
for i, archivo in enumerate(archivos_imagen, start=1):
    # Obtener la extensión del archivo
    extension = os.path.splitext(archivo)[1]
    # Crear el nuevo nombre
    nuevo_nombre = f"sticker{i}{extension}"
    # Ruta completa del archivo antiguo y nuevo
    ruta_antigua = os.path.join(carpeta, archivo)
    ruta_nueva = os.path.join(carpeta, nuevo_nombre)
    # Renombrar el archivo
    os.rename(ruta_antigua, ruta_nueva)
    print(f"Renombrado: {archivo} -> {nuevo_nombre}")

print("¡Todos los archivos han sido renombrados!")