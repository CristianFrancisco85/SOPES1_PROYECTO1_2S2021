obj-m += ram.o # Definir el nombre del archivo que esperamos de salida
all:
    # Definir que se hará cuando se compile
	make -C /lib/modules/$(shell uname -r)/build M=$(shell pwd)
modulesclean:
    # Definir que se hará cuando se limpie el módulo
	make -C /lib/modules/$(shell uname -r)/build M=$(shell pwd) clean