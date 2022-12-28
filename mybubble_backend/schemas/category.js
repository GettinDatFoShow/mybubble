export default {
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string'
        },
        {
            name: 'imageUrl',
            title: 'ImageUrl',
            type: 'string',
            options: {
                hotspot: true
            }
        }
    ]
}