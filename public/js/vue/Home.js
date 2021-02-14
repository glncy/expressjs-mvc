window.onload = function () {
    new Vue({
        el: '#app',
        vuetify: new Vuetify(),
        data: () => ({
            tasks: [
                {
                done: false,
                text: 'Foobar',
                },
                {
                done: false,
                text: 'Fizzbuzz',
                },
            ],
            newTask: null,
        }),
        computed: {
            completedTasks () {
                return this.tasks.filter(task => task.done).length
            },
            progress () {
                return this.completedTasks / this.tasks.length * 100
            },
            remainingTasks () {
                return this.tasks.length - this.completedTasks
            },
        },

        methods: {
            create () {
                this.tasks.push({
                    done: false,
                    text: this.newTask,
                })
                this.newTask = null
            },
        },
    });
}