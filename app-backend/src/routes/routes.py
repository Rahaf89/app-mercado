import sys
import os
sys.path.append(os.path.dirname(os.path.realpath(__file__)))


from comment import comment
from payment import payment
from products import product
from category import category
from users import user
from order import order
from post import post

def add_blueprint(app):
    app.register_blueprint(comment)
    app.register_blueprint(product)
    app.register_blueprint(category)
    app.register_blueprint(user)
    app.register_blueprint(payment)
    app.register_blueprint(order)
    app.register_blueprint(post)