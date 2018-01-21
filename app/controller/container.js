'use strict';

// https://github.com/apocas/dockerode

const child_process = require('child_process');
const Controller = require('egg').Controller;
const Docker = require('dockerode');

const dockerClient = Docker({ socketPath: '/var/run/docker.sock' });

class ContainerController extends Controller {
    async index() {
        const { ctx, service } = this;
        const list = await dockerClient.listContainers();
        // console.log(JSON.stringify(list));
        await ctx.render('screen/container/index', {
            _csrf: ctx.csrf,
            list
        });
    }
    async new() {
    }
    async create() {
        const { ctx, service } = this;
        const { image_id, ssh_port, server_port } = ctx.request.body;
        const container = await dockerClient.run(image_id, null, process.stdout, {
            Image: image_id,
            // 运行时和宿主环境相关的信息在HostConfig里设置
            // https://docs.docker.com/engine/api/v1.32/#operation/ContainerCreate
            HostConfig: {
                PortBindings: {
                    "22/tcp": [
                        {
                            "HostIp": "0.0.0.0",
                            "HostPort": "10112"
                        }
                    ],
                    "80/tcp": [
                        {
                            "HostIp": "0.0.0.0",
                            "HostPort": "8081"
                        }
                    ]
                },
                Binds: ['/Users/nanda221/Code/one-console:/webapp']
            }
        });
        ctx.body = container;
    }
    async destroyAll() {
        const { ctx, service } = this;
        const res = child_process.spawnSync('docker', ['ps', '-a', '-q']);
        if (res.error) {
            ctx.body = res.error;
        }
        else if (res.status !== 0) {
            ctx.body = new String(res.stderr);
        }
        else {
            const containers = new String(res.stdout).split('\n').slice(0, -1);
            if(containers.length) {
                const rmRes = child_process.spawnSync('docker', ['rm', '-f'].concat(containers));
                ctx.body = 'Destroy containers: ' + new String(rmRes.stdout);
            }
            else {
                ctx.body = 'no containers exist.';
            }
        }
    }
}

module.exports = ContainerController;
