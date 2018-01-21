'use strict';

const Controller = require('egg').Controller;
const Docker = require('dockerode');

const dockerClient = Docker({ socketPath: '/var/run/docker.sock' });

class OpsController extends Controller {
    async index() {
        const { ctx, service } = this;
        const ids = await new Promise((resolve, reject) => {
            dockerClient.listContainers((err, containers) => {
                containers.forEach(function (containerInfo) {
                    // console.log(containerInfo);
                    // console.log(dockerClient.getContainer(containerInfo.Id))
                });
                resolve(containers.map((info) => {
                    return JSON.stringify(info)
                }).join(' '));
            });
        });
        await ctx.render('screen/ops/index', {
            ids
        });
    }
    async new() {
        const { ctx, service } = this;
        await ctx.render('screen/ops/new', {
            _csrf: ctx.csrf
        });
        console.log(dockerClient.listImages());
    }
    async create() {
        const { ctx, service } = this;
        console.log(ctx.query);
        console.log(ctx.request.body);
        // dockerClient.createContainer({
        //     Image: 'ubuntu:17.04',
        //     AttachStdin: false,
        //     AttachStdout: true,
        //     AttachStderr: true,
        //     Tty: true,
        //     Cmd: ['/bin/bash', '-c', 'tail -f /var/log/dmesg'],
        //     OpenStdin: false,
        //     StdinOnce: false
        // }).then(function (container) {
        //     console.log(container);
        //     return container.start();
        // });
    }
}

module.exports = OpsController;
