import { Application } from "egg";

export default function (app: Application) {
    const { INTEGER, TEXT, STRING } = app.Sequelize;
    const Model = app.model.define('mission_check', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        url: { type: TEXT, allowNull: false },
        table_name: { type: STRING(50), allowNull: false },
        key: { type: STRING(100), allowNull: false },
        status: { type: INTEGER, allowNull: true },
        lang: { type: STRING(5), allowNull: false },
        dev_id: { type: INTEGER }
    }, {
        timestamps: true,
        createdAt: true,
        updatedAt: true,
        underscored: true,
        // hooks: {
        //     afterCreate: async () => {

        //         const res = await Model.findOne({
        //             attributes: [[(Model as any).sequelize.fn('COUNT', (Model as any).sequelize.col('*')), 'num']]
        //         })

        //         if ((res as any).dataValues.num >= 250) {
        //             (Model as any).sequelize.query("DELETE FROM `record_check` ORDER BY `created_at` LIMIT 20;")
        //         }

        //     }
        // }
    })

    return class MissionCheck extends Model {
        static associate() {
        }
    };
}