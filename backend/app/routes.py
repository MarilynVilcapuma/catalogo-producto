from flask import Blueprint, request, jsonify
from .models import Producto
from .import db

productos_bp = Blueprint('productos', __name__)

@productos_bp.route('/productos', methods=['GET'])
def listar_productos():
    nombre = request.args.get('nombre')
    if nombre:
        productos = Producto.query.filter(Producto.nombre.ilike(f'%{nombre}%')).all()
    else:
        productos = Producto.query.all()
    return jsonify([{
        'id': p.id,
        'nombre': p.nombre,
        'precio': p.precio,
        'descripcion': p.descripcion
    } for p in productos])

@productos_bp.route('/productos', methods=['POST'])
def agregar_producto():
    data = request.json
    nuevo = Producto(
        nombre=data['nombre'],
        precio=data['precio'],
        descripcion=data.get('descripcion', '')
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({'mensaje': 'Producto agregado'}), 201

@productos_bp.route('/productos/<int:id>', methods=['PUT'])
def modificar_producto(id):
    data = request.json
    producto = Producto.query.get_or_404(id)
    producto.nombre = data['nombre']
    producto.precio = data['precio']
    producto.descripcion = data.get('descripcion', '')
    db.session.commit()
    return jsonify({'mensaje': 'Producto modificado'})

@productos_bp.route('/productos/<int:id>', methods=['DELETE'])
def eliminar_producto(id):
    producto = Producto.query.get_or_404(id)
    db.session.delete(producto)
    db.session.commit()
    return jsonify({'mensaje': 'Producto eliminado'})