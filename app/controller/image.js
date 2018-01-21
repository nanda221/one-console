'use strict';

// https://github.com/apocas/dockerode

const Controller = require('egg').Controller;
const Docker = require('dockerode');

const dockerClient = Docker({ socketPath: '/var/run/docker.sock' });

class ImageController extends Controller {
    async index() {
        const { ctx, service } = this;
        const list = await dockerClient.listImages();
        // list.forEach(element => {
        //     console.log(element);
        // });
        await ctx.render('screen/image/index', {
            list
        });
    }
    async new() {
        const { ctx, service } = this;
        await ctx.render('screen/image/new', {
            _csrf: ctx.csrf,
            image_tag: ctx.query.tag || ''
        });
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
}

module.exports = ImageController;
