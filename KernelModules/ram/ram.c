/*
Archivo: [nombre_modulo].c
*/

// Librerías a cargar
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>
#include <linux/fs.h>
#include <linux/mm.h>


MODULE_LICENSE("MODULO");
MODULE_AUTHOR("Josue Orellana");
MODULE_DESCRIPTION("Lectura de Uso de RAM");
MODULE_VERSION("1.0");

struct sysinfo inf;

static int get_data(struct seq_file * file, void *v){
    si_meminfo(&inf);
    unsigned long total = (inf.totalram*4);
    unsigned long libre = (inf.freeram*4);
    seq_printf(file, "{\n");
    seq_printf(file,"\"total\": %lu,\n",total/1024);
    seq_printf(file,"\"libre\": %lu,\n", libre/1024);
    seq_printf(file,"\"en_uso\": %lu\n", ((total - libre)*100)/total);
    seq_printf(file, "}\n");
    return 0;
}

static int abrir(struct inode *inode,struct file * file){
    return single_open(file,get_data,NULL);
}

static struct file_operations ops = {
    .open = abrir,
    .read = seq_read,
};

static int start(void){
    proc_create("ram",0,NULL,&ops);
    return 0;
}

static void __exit finish(void){
    remove_proc_entry("ram",NULL);
}

module_init(start);
module_exit(finish);
