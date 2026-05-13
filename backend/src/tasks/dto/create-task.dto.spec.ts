import { validate } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

describe('CreateTaskDto', () => {
  const validateDto = (payload: Partial<CreateTaskDto>) => {
    const dto = new CreateTaskDto();
    Object.assign(dto, payload);

    return validate(dto);
  };

  it('requires task titles to be at least 3 characters long', async () => {
    const errors = await validateDto({ title: 'ab' });

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchObject({
      minLength: 'Task title must be at least 3 characters long.',
    });
  });

  it('allows task titles within the 3 to 100 character range', async () => {
    await expect(validateDto({ title: 'abc' })).resolves.toHaveLength(0);
    await expect(validateDto({ title: 'a'.repeat(100) })).resolves.toHaveLength(
      0,
    );
  });

  it('requires task titles to be at most 100 characters long', async () => {
    const errors = await validateDto({ title: 'a'.repeat(101) });

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchObject({
      maxLength: 'Task title must be at most 100 characters long.',
    });
  });

  it('allows low, medium, and high task priority values', async () => {
    await expect(validateDto({ title: 'abc', priority: 'low' })).resolves.toHaveLength(
      0,
    );
    await expect(
      validateDto({ title: 'abc', priority: 'medium' }),
    ).resolves.toHaveLength(0);
    await expect(validateDto({ title: 'abc', priority: 'high' })).resolves.toHaveLength(
      0,
    );
  });

  it('rejects unsupported task priority values', async () => {
    const errors = await validateDto({
      title: 'abc',
      priority: 'urgent' as never,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchObject({
      isEnum: 'Task priority must be one of: low, medium, high.',
    });
  });
});
