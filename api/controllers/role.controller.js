import Role from '../models/role.js'

//logic for the role controller
export const createRole = async (req, res, next) => {
    try {
        if (req.body.role && req.body.role.trim() !== '') {
            const newRole = new Role(req.body)
            await newRole.save()
            res.status(201).json({ message: 'Role created successfully', role: newRole })
        } else {
            res.status(400).json({ message: 'Role is required' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

//logic for the role update controller

export const updateRole = async (req, res, next)=> {
    try {
        const role = await Role.findById({_id: req.params.id});

        if(role) {
            const newDate = await Role.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                {new: true}
            )
            return res.status(200).json(newDate)
        }

        else{
            return res.status(404).json({message: "Role not found"})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

//logic to get all the roles

export const getAllRoles = async (req, res, next) => {

    try {
        const roles = await Role.find({})
        res.status(200).send(roles)
    
    } catch (error) {
    
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

export const deletRole = async (req, res, next) => {
    try {
        const role = await Role.findByIdAndDelete({ _id: req.params.id });

        if (role) {
            await Role.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: 'Role deleted successfully' })
        } else {
            res.status(404).json({ message: 'Role not found' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}