// Librerías a cargar
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>
#include <linux/fs.h>
#include <linux/smp.h>     
#include <linux/cpufreq.h>
#include <linux/cpumask.h>

#ifdef pr_fmt
#undef pr_fmt
#endif
#define pr_fmt(fmt) KBUILD_MODNAME ": " fmt

MODULE_LICENSE("MODULO");
MODULE_AUTHOR("Josue Orellana");
MODULE_DESCRIPTION("Lectura de CPU");
MODULE_VERSION("1.0");

struct task_struct *task;       

static int proc_cpu_msg(struct seq_file * file, void *v){
    int procesos = 0;
    //int uso =0;
    seq_printf(file, "{\n");
    for_each_process(task){
        procesos++;
        //seq_printf(file, "\"proceso_%d\":%d\n",(procesos),(refcount_read(&task->usage)));
        //uso = uso + refcount_read(&task->usage);
    }
    seq_printf(file, "\"procesos\":%d",(procesos));
    //seq_printf(file, "\"\ncpu\":%d",(uso));
    seq_printf(file, "\n}");
    return 0;
}

static int my_open(struct inode *inode,struct file * file){
    return single_open(file,proc_cpu_msg,NULL);
}

static struct file_operations ops = {
    .open = my_open,
    .read = seq_read,
};

static int start(void){
    proc_create("cpu",0,NULL,&ops);
    return 0;
}


static void __exit finish(void){
    remove_proc_entry("cpu",NULL);
}

module_init(start);
module_exit(finish);