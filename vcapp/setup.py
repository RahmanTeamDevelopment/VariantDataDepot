from setuptools import setup

setup(
    name='vcapp',
    packages=['vcapp'],
    include_package_data=True,
    install_requires=[
        'flask',
    ],
    setup_requires=[
        'pytest-runner',
    ],
    tests_require=[
        'pytest'
    ],
)
