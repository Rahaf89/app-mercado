import re
from unicodedata import normalize

def deleteAcentos(s):
    
    # -> NFD y eliminar diacríticos
    s = re.sub(
            r"([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+", r"\1", 
            normalize( "NFD", s), 0, re.I
        )

    # -> NFC
    s = normalize( 'NFC', s)
    return s.lower()

export = deleteAcentos