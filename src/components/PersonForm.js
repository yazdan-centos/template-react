import { useForm } from 'react-hook-form';

function PersonForm({ person, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: person || { firstName: '', lastName: '', email: '' },
  });

  return (
    <form className="person-form" onSubmit={handleSubmit(onSave)}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{person ? 'EDIT RECORD' : 'NEW RECORD'}</p>
          <h2>{person ? 'Update person' : 'Add a person'}</h2>
        </div>
        <button type="button" className="icon-button" onClick={onCancel} aria-label="Close">×</button>
      </div>
      <div className="form-grid">
        <label>
          First name
          <input {...register('firstName', { required: true })} />
        </label>
        {errors.firstName && <div className="error">First name is required</div>}
        <label>
          Last name
          <input {...register('lastName', { required: true })} />
        </label>
        {errors.lastName && <div className="error">Last name is required</div>}
        <label className="full">
          Email address
          <input type="email" {...register('email', { required: true })} />
        </label>
        {errors.email && <div className="error">Email is required</div>}
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button className="primary" type="submit">Save person</button>
      </div>
    </form>
  );
}

export default PersonForm;
